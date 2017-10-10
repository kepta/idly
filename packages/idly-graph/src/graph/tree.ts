import { ImSet } from 'idly-common/lib/misc/immutable';
import { entityFactory } from 'idly-common/lib/osm/entityFactory';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { removeFromEntityTable } from 'idly-common/lib/osm/removeFromEntityTable';
import { Entity, EntityId, EntityTable, NodeId, ParentWays, Way, WayId } from 'idly-common/lib/osm/structures';

import { calculateParentWays } from '../misc/calculateParentWays';

const EMPTY_ARRAY = Object.freeze([]);

export interface ToObjectType {
  readonly deletedIds: ImSet<EntityId>;
  readonly knownIds: ImSet<EntityId>;
  readonly entityTable: EntityTable;
}

export interface ToJsonType {
  readonly deletedIds: EntityId[];
  readonly knownIds: EntityId[];
  readonly entities: Array<Entity | undefined>;
}

/**
 * @TOFIX figure out deleting ids
 *  and merging of two trees
 * @TOFIX figure out parentWays
 *  when one of the id is deleted
 */
export class Tree {
  public static fromString(json: string): Tree {
    const { entities, knownIds, deletedIds }: ToJsonType = JSON.parse(json);
    if (!knownIds || !entities || !deletedIds) {
      throw new Error(
        'This thing is not parsable, please provide a valid tree',
      );
    }
    const table = entityTableGen(entities.map(entityFactory));
    return new Tree(ImSet(knownIds), table, ImSet(deletedIds));
  }

  public static fromObject({
    entityTable,
    knownIds,
    deletedIds,
  }: ToObjectType): Tree {
    if (!knownIds || !entityTable || !deletedIds) {
      throw new Error('wrong schema');
    }
    return new Tree(knownIds, entityTable, deletedIds);
  }

  public static fromEntities(entity: Entity[]): Tree {
    const knownIds = ImSet(entity.map(e => e.id));
    const entityTable = entityTableGen(entity);
    return new Tree(knownIds, entityTable);
  }

  private readonly _deletedIds: ImSet<EntityId>;
  private readonly _knownIds: ImSet<EntityId>;
  private readonly _entityTable: EntityTable;
  private readonly _parentWays: ParentWays;

  constructor(
    knownIds: ImSet<EntityId>,
    entityTable: EntityTable,
    deletedIds: ImSet<EntityId> = ImSet(),
  ) {
    /* tslint:disable */
    this._deletedIds = deletedIds;
    this._knownIds = knownIds;
    this._entityTable = entityTable;
    this._parentWays = calculateParentWays(entityTable, deletedIds);
    /* tslint:enable */
  }

  public toJs(): ToJsonType {
    const obj: ToJsonType = {
      deletedIds: this._deletedIds.toArray(),
      entities: this._entityTable.valueSeq().toArray(),
      knownIds: this._knownIds.toArray(),
    };
    return obj;
  }

  public toObject(): {
    readonly deletedIds: ImSet<EntityId>;
    readonly knownIds: ImSet<EntityId>;
    readonly entityTable: EntityTable;
    readonly parentWays: ParentWays;
  } {
    return {
      deletedIds: this._deletedIds,
      entityTable: this._entityTable,
      knownIds: this._knownIds,
      parentWays: this._parentWays,
    };
  }

  public isEqual(tree: Tree): boolean {
    if (tree === this) {
      return true;
    }
    return (
      this._knownIds.equals(tree._knownIds) &&
      this._deletedIds.equals(tree._deletedIds) &&
      this._entityTable.equals(tree._entityTable) &&
      this._parentWays.equals(tree._parentWays)
    );
  }

  public size(): number {
    return this._entityTable.size;
  }

  public entity(id: EntityId): Entity | undefined {
    if (!this._knownIds.has(id) || this._deletedIds.has(id)) {
      return;
    }
    return this._entityTable.get(id);
  }

  public unsafeGetEntity(id: EntityId): Entity | undefined {
    return this._entityTable.get(id);
  }

  public getParentWay(id: NodeId): Way[] | undefined {
    if (!this._knownIds.has(id) || this._deletedIds.has(id)) {
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
    const ids = ImSet(entities.map(e => e.id));
    const knownIds = ids.union(this._knownIds);
    const deletedIds = this._deletedIds.subtract(ids);
    return new Tree(knownIds, table, deletedIds);
  }

  public addEntities(entities: Entity[]): Tree {
    return this.modifyEntities(entities);
  }

  public removeEntities(entityIds: EntityId[]): Tree {
    const table = removeFromEntityTable(entityIds);
    const deletedIds = ImSet(entityIds);
    const knownIds = this._knownIds.subtract(deletedIds);
    return new Tree(knownIds, table, deletedIds);
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
      this._deletedIds.remove(entity.id),
    );
  }

  public getKnownIds(): EntityId[] {
    return this._knownIds.toArray();
  }

  public getDeletedIds(): EntityId[] {
    return this._deletedIds.toArray();
  }

  public merge(tree: Tree): Tree {
    const { entityTable, knownIds, deletedIds } = tree.toObject();
    return new Tree(
      this._knownIds.union(knownIds),
      this._entityTable.merge(entityTable),
      this._deletedIds.merge(deletedIds),
    );
  }
}
