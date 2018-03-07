import { Entity } from 'idly-common/lib/osm/structures';
import { modifiedGetEntity } from '../state/modified';
import { OsmState } from '../type';

/**
 * makes modified take precedence in getting an entity
 * this is done so we can maintain our baseIds without
 * relying on virgin table which is a black box and should
 * not be relied on.
 */
export function getEntity(id: string, state: OsmState): Entity | undefined {
  return modifiedGetEntity(state.modified, id) || state.virgin.elements.get(id);
}
