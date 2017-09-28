import { ImSet } from 'idly-common/lib/misc/immutable';
import { entityFactory } from 'idly-common/lib/osm/entityFactory';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { removeFromEntityTable } from 'idly-common/lib/osm/removeFromEntityTable';
import { Entity, EntityId, EntityTable, NodeId, ParentWays, Way, WayId } from 'idly-common/lib/osm/structures';

import { calculateParentWays } from '../misc/calculateParentWays';

const EMPTY_ARRAY = Object.freeze([]);

/**
 * @TOFIX figure out deleting ids
 *  and merging of two trees
 */
export class Tree {
  public static fromString(json: string): Tree {
    const { entities, knownIds }: any = JSON.parse(json);
    if (!knownIds || !entities) {
      throw new Error(
        'This thing is not parsable, please provide a valid tree',
      );
    }
    const table = entityTableGen(entities.map(entityFactory));
    return new Tree(ImSet(knownIds), table);
  }

  public static fromObject({ entities, knownIds }: any): Tree {
    if (!knownIds || !entities) {
      throw new Error(
        'This thing is not parsable, please provide a valid tree',
      );
    }
    const table = entityTableGen(entities.map(entityFactory));
    return new Tree(ImSet(knownIds), table);
  }

  public static fromEntities(entity: Entity[]): Tree {
    const knownIds = ImSet(entity.map(e => e.id));
    const entityTable = entityTableGen(entity);
    return new Tree(knownIds, entityTable);
  }

  private _knownIds: ImSet<EntityId>;
  private _entityTable: EntityTable;
  private _parentWays: ParentWays;

  constructor(
    knownIds: ImSet<EntityId>,
    entityTable: EntityTable,
    parentWays?: ParentWays,
  ) {
    /* tslint:disable */
    this._knownIds = knownIds;
    this._entityTable = entityTable;
    this._parentWays = parentWays || calculateParentWays(entityTable);
    /* tslint:enable */
  }

  public toJSON(): string {
    return JSON.stringify({
      entities: this._entityTable.valueSeq().toArray(),
      knownIds: this._knownIds,
    });
  }

  public toObject(): {
    readonly knownIds: ImSet<EntityId>;
    readonly entityTable: EntityTable;
    readonly parentWays: ParentWays;
  } {
    return {
      entityTable: this._entityTable,
      knownIds: this._knownIds,
      parentWays: this._parentWays,
    };
  }

  public size(): number {
    return this._entityTable.size;
  }

  public entity(id: EntityId): Entity | undefined {
    if (!this._knownIds.has(id)) {
      return;
    }
    return this._entityTable.get(id);
  }

  public unsafeGetEntity(id: EntityId): Entity | undefined {
    return this._entityTable.get(id);
  }

  public getParentWay(id: NodeId): Way[] | undefined {
    if (!this._knownIds.has(id)) {
      return;
    }
    const parentWay = this._parentWays.get(id);
    if (!parentWay) {
      return;
    }
    const wayIds = parentWay.toArray();
    return wayIds
      .map(wayId => this.unsafeGetEntity(wayId))
      .filter(w => w) as Way[];
  }

  public getParentWayIds(id: NodeId): ReadonlyArray<WayId> {
    const parentWay = this._parentWays.get(id);
    if (!this._knownIds.has(id) || !parentWay) {
      return EMPTY_ARRAY;
    }
    return parentWay.toArray();
  }

  public hasParentWay(id: NodeId): boolean {
    if (!this._knownIds.has(id)) {
      return false;
    }
    const ids = this._parentWays.get(id);
    return ids ? ids.size > 0 : false;
  }

  public modifyEntities(entities: Entity[]): Tree {
    const table = entityTableGen(entities, this._entityTable);
    const knownIds = ImSet(entities.map(e => e.id)).union(this._knownIds);
    return new Tree(knownIds, table);
  }

  public addEntities(entities: Entity[]): Tree {
    return this.modifyEntities(entities);
  }

  public removeEntities(entityIds: EntityId[]): Tree {
    const table = removeFromEntityTable(entityIds);
    const knownIds = this._knownIds.subtract(ImSet(entityIds));
    return new Tree(knownIds, table);
  }

  public replace(entity?: Entity): Tree {
    if (!entity || this.unsafeGetEntity(entity.id) === entity) {
      return this;
    }
    // @REVISIT this could be PIA, but for now let them recompute
    //  parentWays parentRelations everytime.
    return new Tree(
      this._knownIds.add(entity.id),
      this._entityTable.set(entity.id, entity),
    );
  }

  public getKnownIds(): EntityId[] {
    return this._knownIds.toArray();
  }

  public merge(tree: Tree): Tree {
    const { entityTable, knownIds, parentWays } = tree.toObject();
    return new Tree(
      this._knownIds.union(knownIds),
      this._entityTable.merge(entityTable),
      this._parentWays.merge(parentWays),
    );
  }
}
