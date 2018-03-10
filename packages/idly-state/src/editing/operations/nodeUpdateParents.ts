import { Entity, Node, Relation, Way } from 'idly-common/lib/osm/structures';

import { Table } from '../../dataStructures/table';
import { sureGet } from '../misc/sureGet';
import { entityUpdateParentRelations } from '../pure/entityUpdateParentRelations';
import { nodeUpdateParentWays } from '../pure/nodeUpdateParentWays';

export function nodeUpdateParents({
  prevNode,
  newNode,
  parentWays,
  parentRelationsLookup,
  idGen,
}: {
  prevNode: Node;
  newNode: Node;
  parentWays: Way[];
  parentRelationsLookup: Table<Relation[]>;
  idGen: (e: Entity) => string;
}): Entity[] {
  const updatedWays = nodeUpdateParentWays(
    prevNode,
    newNode,
    parentWays,
    idGen
  );

  const entitiesPair = [
    [prevNode, newNode],
    ...parentWays.map((w, i): [Way, Way] => [w, updatedWays[i]]),
  ];

  const relationsLookup = new Map<string, Relation>();

  for (const relationArray of parentRelationsLookup.values()) {
    for (const rel of relationArray) {
      relationsLookup.set(rel.id, rel);
    }
  }

  const relationIdsUsed = new Set();

  /**
   * We would want to keep the updated relation
   * around so that we can reuse it for any other entity
   * which can then resuse it and not erase any modification
   * to that relation.
   */
  for (const [prevEntity, newEntity] of entitiesPair) {
    const parentRelationIds = sureGet(prevEntity.id, parentRelationsLookup).map(
      r => r.id
    );

    const updatedParentRelations = parentRelationIds.map(
      rId => relationsLookup.get(rId) as Relation
    );

    const newRelations = entityUpdateParentRelations(
      prevEntity,
      newEntity,
      updatedParentRelations,
      idGen
    );

    newRelations.forEach((r, i) => {
      relationIdsUsed.add(r.id);
      // we would continue using the original id of relation
      // as any entity might be asking for it
      relationsLookup.set(parentRelationIds[i], r);
    });
  }

  const finalRelations = [...relationsLookup.values()].filter(r =>
    relationIdsUsed.has(r.id)
  );

  return [...updatedWays, ...finalRelations];
}
