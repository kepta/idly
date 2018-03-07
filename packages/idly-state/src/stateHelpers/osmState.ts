import { Entity } from 'idly-common/lib/osm/structures';

import { Table } from '../dataStructures/table';
import { waysGetNodeIds } from '../editing/pure/wayGetNodeIds';
import { OsmState } from '../type';
import { getEntity } from './getEntity';

/**
 * Renderable entities are nodes, wayds and nodesOfWays.
 *
 * Why not relations?
 * reading relations can be problematic because of two things
 * relation members cannot be resolved deterministically and second
 * even if have a way which is a member of relation
 * can be added and then we will have to download
 * all the ways node.
 */
export function getRenderableEntities(
  ids: Set<string>,
  state: OsmState
): Table<Entity> {
  const result: Map<string, Entity> = new Map();
  for (const id of ids) {
    const e = getEntity(id, state);
    if (!e) {
      throw new Error('entity not found ' + id);
    }

    result.set(id, e);

    waysGetNodeIds(e)
      .map(nodeId => getEntity(nodeId, state))
      .forEach(node => {
        if (!node) {
          throw new Error('node for ' + id + ' not found');
        }
        result.set(node.id, node);
      });
  }
  return result;
}
