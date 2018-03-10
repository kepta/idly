import { Entity, EntityType } from 'idly-common/lib/osm/structures';

import { setCreate, setEqual } from '../../dataStructures/set';

export type DerivedTable = Map<string, Derived>;

export interface Derived {
  readonly entity: Entity;
  readonly parentWays: Set<string>;
  readonly parentRelations: Set<string>;
}

export type DerivedCreateType = (entity: Entity) => Derived;
export const derivedCreate: DerivedCreateType = entity => ({
  entity,
  parentRelations: setCreate<string>(),
  parentWays: setCreate<string>(),
});

// 1. Add expanded nodes to ways, this will remove dependency on table
//     note than nodes of ways is a derived data for ways and not table
//     in this file we derive everything and then compare, deriving nodes
///     everytime wont be a good idea

export type DerivedTableUpdateType = (
  entityTable: Map<string, Entity>,
  derivedTable?: Map<string, Derived>
) => DerivedTable;

export const derivedTableUpdate: DerivedTableUpdateType = (
  entityTable,
  derivedTable = new Map()
) => {
  const newTable = derive(entityTable);

  newTable.forEach((newVal, id) => {
    const prevVal = derivedTable.get(id);

    return isEqual(newVal, prevVal)
      ? newTable.set(id, prevVal as Derived) // puts the prevVal in newTable to preserve the instance for === caching
      : derivedTable.set(id, newVal);
  });

  return newTable;
};

export type DeriveParentsType = (
  entityTable: Map<string, Entity>
) => DerivedTable;
export const derive: DeriveParentsType = entityTable => {
  const derivedTable: Map<string, Derived> = new Map();

  entityTable.forEach(entity =>
    derivedTable.set(entity.id, derivedCreate(entity))
  );

  derivedTable.forEach(compute => {
    if (compute.entity.type === EntityType.WAY) {
      compute.entity.nodes.forEach(nodeId => {
        const val = derivedTable.get(nodeId);
        if (!val) {
          throw new Error(
            `${compute.entity.id} doesnt have node=${nodeId} in derivedTable`
          );
        }
        val.parentWays.add(compute.entity.id);
      });
    } else if (compute.entity.type === EntityType.RELATION) {
      compute.entity.members.forEach(({ id }) => {
        const entityComp = derivedTable.get(id);
        if (entityComp) {
          entityComp.parentRelations.add(compute.entity.id);
        }
      });
    }
  });
  return derivedTable;
};

export const isEqual = (a: Derived, b?: Derived) => {
  if (!a || !b) {
    return false;
  }
  if (a.entity !== b.entity) {
    return false;
  }
  if (a.entity.type === EntityType.NODE) {
    if (!setEqual(a.parentWays, b.parentWays)) {
      return false;
    }
  }
  if (!setEqual(a.parentRelations, b.parentRelations)) {
    return false;
  }
  return true;
};
