import { Entity } from 'idly-common/lib/osm/structures';

import { baseId } from '../../dataStructures/log';
import { iterableFlattenToArray } from '../../dataStructures/set';
import { waysGetNodeIds } from '../../editing/pure/wayGetNodeIds';
import { OsmState } from '../../type';

export function entityGetNodesOfWays(
  entity: Entity,
  virgin: OsmState['virgin']
): Entity[] {
  return entityIdsToEntities(waysGetNodeIds(entity), virgin);
}

export function entitiesGetNodesOfWays(
  entities: Entity[],
  virgin: OsmState['virgin']
): Entity[] {
  return iterableFlattenToArray(
    entities.map(r => {
      return entityGetNodesOfWays(r, virgin);
    })
  );
}

export function entitiesUnionBaseAndNodesOfWays(
  entities: Entity[],
  virgin: OsmState['virgin']
): Entity[] {
  const baseEntities = entitiesToBaseEntities(entities, virgin);
  const nodesOfWays = entitiesGetNodesOfWays(
    entities.concat(baseEntities),
    virgin
  );
  return [...entities, ...baseEntities, ...nodesOfWays];
}

export function entityIdsToEntities(
  ids: Iterable<string> | IterableIterator<string>,
  virgin: OsmState['virgin']
): Entity[] {
  const result = [];
  for (const id of ids) {
    const e = virgin.elements.get(id);
    if (e) {
      result.push(e);
    }
  }
  return result;
}

const entitiesToBaseEntities = (
  entities: Entity[],
  virgin: OsmState['virgin']
): Entity[] =>
  entities
    .map(r => baseId(r.id))
    .map(bId => virgin.elements.get(bId))
    .filter((r): r is Entity => !!r);
