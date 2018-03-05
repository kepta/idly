import { Entity } from 'idly-common/lib/osm/structures';
import { changedTableGetEntity } from '../osmState';
import { OsmState } from '../type';

export function getEntity(id: string, state: OsmState): Entity | undefined {
  return (
    changedTableGetEntity(state.changedTable, state.log, id) ||
    state.virgin.elements.get(id)
  );
}
