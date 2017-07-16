import { Record, Map } from 'immutable';
import { uniqWith } from 'ramda';
import { Action } from 'src/store/actions';
import { OSM_TILES } from 'src/store/osm_tiles/actions';
const initialState = {
  tiles: Map(),
  legacy: []
};

export class OsmTilesState extends Record(initialState) {
  tiles: Map<string, any>;
  legacy: any[];
}
const osmTilesState = new OsmTilesState();

export function osmReducer(state = osmTilesState, action: Action<any>) {
  switch (action.type) {
    case OSM_TILES.saveTile: {
      let newState = <OsmTilesState>state.setIn(
        ['tiles', action.coords.join(',')],
        action.data
      );
      // newState = <OsmTilesState>newState.set(
      //   'legacy',
      //   uniqWith((a, b) => a.id === b.id, newState.legacy.concat(action.legacy))
      // );
      return newState;
    }
    default:
      return state;
  }
}
var win: any = window;
win.Record = Record;
