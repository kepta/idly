import { Entity, EntityType } from '../../osm/structures';
import { setCreate, setEqual } from '../helper';

export type DerivedTable = Map<string, Derived>;

export interface Derived {
  readonly entity: Entity;
  readonly parentWays: Set<string>;
  readonly parentRelations: Set<string>;
}

export const derivedCreate = (entity: Entity): Derived => ({
  entity,
  parentRelations: setCreate<string>(),
  parentWays: setCreate<string>(),
});

export function updateDerivedValues(
  entityTable: Map<string, Entity>,
  derivedTable: Map<string, Derived> = new Map()
): DerivedTable {
  const intermediateTable = computeParents(entityTable);

  const result = new Map();

  intermediateTable.forEach((compute, id) => {
    const prevVal = derivedTable.get(id);
    // both values are same, it is useless
    // to update the reference.
    if (isComputedEqual(compute, prevVal)) {
      return result.set(id, prevVal);
    }
    // updates the derivedTable for futureUse
    derivedTable.set(id, compute);
    return result.set(id, compute);
  });

  return result;
}

const isComputedEqual = (fresh: Derived, cB?: Derived) => {
  if (!fresh || !cB) {
    return false;
  }
  if (fresh.entity !== cB.entity) {
    return false;
  }
  if (fresh.entity.type === EntityType.NODE) {
    if (!setEqual(fresh.parentWays, cB.parentWays)) {
      return false;
    }
  }
  if (!setEqual(fresh.parentRelations, cB.parentRelations)) {
    return false;
  }
  return true;
};

export const computeParents = (
  entityTable: Map<string, Entity>
): DerivedTable => {
  const computedTable: Map<string, Derived> = new Map();

  entityTable.forEach(entity =>
    computedTable.set(entity.id, derivedCreate(entity))
  );

  computedTable.forEach(comput => {
    if (comput.entity.type === EntityType.WAY) {
      comput.entity.nodes.forEach(nodeId => {
        const nodeCompute = computedTable.get(nodeId);
        if (nodeCompute) {
          nodeCompute.parentWays.add(comput.entity.id);
        }
      });
    } else if (comput.entity.type === EntityType.RELATION) {
      comput.entity.members.forEach(({ id }) => {
        const entityComp = computedTable.get(id);
        if (entityComp) {
          entityComp.parentRelations.add(comput.entity.id);
        }
      });
    }
  });
  return computedTable;
};
