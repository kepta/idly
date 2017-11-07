import { wayFactory } from 'idly-common/lib/osm/wayFactory';
import { Iterable, Set as ImSet } from 'immutable';

import { entityFactoryCache } from 'idly-common/lib/osm/entityFactory';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { removeFromEntityTable } from 'idly-common/lib/osm/removeFromEntityTable';
import {
  Entity,
  EntityId,
  EntityTable,
  EntityType,
  Node,
  NodeId,
  ParentWays,
  Relation,
  Way,
  WayId,
} from 'idly-common/lib/osm/structures';

import { calculateParentWays } from '../misc/calculateParentWays';

const cachedEntityFactory = entityFactoryCache();
const EMPTY_ARRAY = Object.freeze([]);
export interface ToObjectType {
  readonly deletedIds: ImSet<EntityId>;
  readonly knownIds: ImSet<EntityId>;
  readonly entityTable: EntityTable;
}

export interface ToJsonType {
  readonly deletedIds: EntityId[];
  readonly knownIds: EntityId[];
  readonly entities: string[];
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
    const table = entityTableGen(entities.map(cachedEntityFactory));
    return new Tree(ImSet(knownIds), table, ImSet(deletedIds));
  }

  public static fromObject({
    entityTable,
    knownIds,
    deletedIds,
  }: ToObjectType): Tree {
    if (!knownIds || !entityTable) {
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
      entities: this._entityTable
        .valueSeq()
        .toArray()
        .map(e => JSON.stringify(e)),
      knownIds: this._knownIds.toArray(),
    };
    return obj;
  }

  public toString(): string {
    return JSON.stringify(this.toJs());
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

  /**
   * @BUG _entityTable shows some other world when doing
   * this on the main thread. The objects(enitity) are not exactly
   * equal even though they are deep equal because they have
   * different instances running. I think when we parse a string
   * we might wanna cache the object in some sort of global store
   * to avoid creating another instance of the same thing.
   * @param tree
   */
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

  public getParentWays(id: NodeId): Way[] | undefined {
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

  // public removeEntities(entityIds: EntityId[]): Tree {
  //   const table = removeFromEntityTable(entityIds);
  //   const deletedIds = ImSet(entityIds);
  //   const knownIds = this._knownIds.subtract(deletedIds);
  //   return new Tree(knownIds, table, deletedIds);
  // }

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
      this._deletedIds.union(deletedIds),
    );
  }
  public get(id: EntityId): Entity | undefined {
    if (!this._knownIds.has(id) || this._deletedIds.has(id)) {
      return;
    }
    return this._entityTable.get(id);
  }

  public removeNode(id: EntityId): Tree {
    let { entityTable } = this.toObject();
    const parent = this._parentWays.get(id);

    if (parent) {
      const ways = parent.map((wayId = '') => {
        const way = this.get(wayId) as Way;
        if (!way) {
          throw new Error('way' + wayId + ' must be in the knownIds');
        }
        // tslint:disable-next-line:no-expression-statement
        entityTable = entityTable.set(
          wayId,
          wayFactory(
            Object.assign({}, way, {
              nodes: way.nodes.filter(n => n === id),
            }),
          ),
        );
      });
    }
    return Tree.fromObject({
      deletedIds: this._deletedIds.add(id),
      entityTable: entityTable.remove(id),
      knownIds: this._knownIds.remove(id),
    });
  }
  public remove(id: EntityId): Tree {
    const entity = this.get(id);
    if (!entity) {
      // tslint:disable-next-line:no-expression-statement
      console.error('couldnt find entity' + id);
      return this;
    }
    // tslint:disable:no-expression-statement

    let { entityTable, knownIds, deletedIds, parentWays } = this.toObject();

    switch (entity.type) {
      case EntityType.NODE: {
        const parent = parentWays.get(id);
        if (!parent) {
          break;
        }
        const ways = parent.map((wayId = '') => {
          const way = this.get(wayId) as Way;
          if (!way) {
            throw new Error('way' + wayId + ' must be in the knownIds');
          }
          entityTable = entityTable.set(
            wayId,
            wayFactory(
              Object.assign({}, way, {
                nodes: way.nodes.filter(n => n === id),
              }),
            ),
          );
        });
        break;
      }
      case EntityType.WAY: {
        const way = this.get(id) as Way;
        if (!way) {
          throw new Error('way' + id + ' must be in the knownIds');
        }
        entityTable = deleteInEntityTable(way.nodes as EntityId[], entityTable);
        break;
      }
      case EntityType.RELATION: {
        // @TOFIX
        break;
      }
    }

    // tslint:enable:no-expression-statement
  }
  /**
   * if any side effect returns `false` loop exits.
   * @param cb
   */
  public forEach(cb: (p: Entity) => any): number {
    return this._knownIds.forEach((id = '') => {
      const entity = this._entityTable.get(id);
      if (entity) {
        return cb(entity);
      }
    });
  }

  public nodeMap(cb: (node: Node, getParentWays: any) => Node): Tree {
    const { entityTable, knownIds } = this.toObject();

    const oldEntities = knownIds
      .filter((id = '') => id[0] === 'n')
      .map((id = '') => entityTable.get(id)) as Iterable<string, Node>;

    const bindedGetParentWays = this.getParentWays.bind(this);

    const newEntities = oldEntities.map(prevEntity => {
      if (!prevEntity) {
        return;
      }
      const newEntity = cb(prevEntity, bindedGetParentWays);

      if (newEntity === prevEntity) {
        return prevEntity;
      }
      if (newEntity.id !== prevEntity.id) {
        throw new Error('Not allowed to change entity id');
      }
      if (newEntity.type !== prevEntity.type) {
        throw new Error('Not allowed to change the entity type');
      }

      return newEntity;
    });

    const table = setInEntityTable(newEntities, entityTable);

    const newIds = ImSet(
      newEntities.map(entity => entity && entity.id),
    ) as ImSet<string>;

    return new Tree(newIds, table);
  }
}

function setInEntityTable(
  entities: Iterable<string, Node | Way | Relation | undefined>,
  table: EntityTable,
): EntityTable {
  return table.withMutations(t => {
    // tslint:disable:no-expression-statement
    entities.forEach(entity => {
      if (entity) {
        t.set(entity.id, entity);
      }
    });
    // tslint:enable:no-expression-statement
  });
}

function deleteInEntityTable(
  ids: ImSet<EntityId> | EntityId[],
  table: EntityTable,
): EntityTable {
  // tslint:disable:no-expression-statement
  if (Array.isArray(ids)) {
    return table.withMutations(t => {
      ids.forEach((id = '') => {
        t.delete(id);
      });
    });
  }
  return table.withMutations(t => {
    ids.forEach((id = '') => {
      t.delete(id);
    });
  });
  // tslint:enable:no-expression-statement
}

function addInEntityTable(
  entities: Iterable<string, Node | Way | Relation | undefined>,
  table: EntityTable,
): EntityTable {
  // tslint:disable:no-expression-statement
  return table.withMutations(t => {
    entities.forEach(entity => {
      if (entity) {
        t.set(entity.id, entity);
      }
    });
  });
  // tslint:enable:no-expression-statement
}
