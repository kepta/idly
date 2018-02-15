import { Entity, EntityType } from 'idly-common/lib/osm/structures';

import { setCreate, setEqual } from '../helper';

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
///     everytime wont be agood idea

export type DerivedTableUpdateType = (
  entityTable: Map<string, Entity>,
  derivedTable?: Map<string, Derived>
) => DerivedTable;

export const derivedTableUpdate: DerivedTableUpdateType = (
  entityTable,
  derivedTable = new Map()
) => {
  const intermediateTable = deriveParents(entityTable);

  intermediateTable.forEach((val, id) => {
    const prevVal = derivedTable.get(id);

    return isEqual(val, prevVal)
      ? intermediateTable.set(id, prevVal as Derived)
      : derivedTable.set(id, val);
  });

  return intermediateTable;
};

export type DeriveParentsType = (
  entityTable: Map<string, Entity>
) => DerivedTable;
export const deriveParents: DeriveParentsType = entityTable => {
  const derivedTable: Map<string, Derived> = new Map();

  entityTable.forEach(entity =>
    derivedTable.set(entity.id, derivedCreate(entity))
  );

  derivedTable.forEach(comput => {
    if (comput.entity.type === EntityType.WAY) {
      comput.entity.nodes.forEach(nodeId => {
        const val = derivedTable.get(nodeId);
        if (val) {
          val.parentWays.add(comput.entity.id);
        }
      });
    } else if (comput.entity.type === EntityType.RELATION) {
      comput.entity.members.forEach(({ id }) => {
        const entityComp = derivedTable.get(id);
        if (entityComp) {
          entityComp.parentRelations.add(comput.entity.id);
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
