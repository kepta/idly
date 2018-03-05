import {
  Entity,
  EntityType,
  Node,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { iterableFlattenToArray } from '../../helper';
import { Table } from '../../table';
import { entityUpdateParentRelations } from '../helpers/entityUpdateParentRelations';
import { nodeUpdateParentWays } from '../helpers/nodeUpdateParentWays';
import { sureGet } from './sureGet';
import { wayUpdateParents } from './wayUpdateParents';

export function nodeUpdateParents(
  prevNode: Node,
  newNode: Node,
  parentWaysTable: Table<Way[]>,
  parentRelationsTable: Table<Relation[]>,
  idGen: (e: Entity) => string
): Entity[] {
  const parentWays = sureGet(prevNode.id, parentWaysTable);
  const parentRelations = sureGet(prevNode.id, parentRelationsTable);

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
  // flatten parent relation
  for (const relationArray of parentRelationsTable.values()) {
    for (const rel of relationArray) {
      relationsLookup.set(rel.id, rel);
    }
  }

  const relationIdsUsed = new Set();
  for (const [prevEntity, newEntity] of entitiesPair) {
    const actualParentR = sureGet(prevEntity.id, parentRelationsTable);

    // put the updated parent relations in this
    // so that if some other entity refers to that
    // same relation, it uses the modified relation
    // instead of creating a fresh and loosing any prev updates
    const updatedParentRelations = actualParentR.map(
      r => relationsLookup.get(r.id) as Relation
    );

    // goal is to reuse the same original id but keep
    // changing the actual relation so that
    // multiple node / way sharing the same relation
    // update that relation only.
    const newRelations = entityUpdateParentRelations(
      prevEntity,
      newEntity,
      updatedParentRelations,
      idGen
    );

    newRelations.forEach((r, i) => {
      relationIdsUsed.add(r.id);
      relationsLookup.set(actualParentR[i].id, r);
    });
  }

  const finalRelations = [...relationsLookup.values()].filter(r =>
    relationIdsUsed.has(r.id)
  );

  return [...updatedWays, ...finalRelations];
}
