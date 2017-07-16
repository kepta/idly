import { Record, Map } from 'immutable';
import { Action } from 'src/store/actions';
import { OSM_TILES } from 'src/store/osm_tiles/actions';

const initialState = {
  tiles: Map()
};

export class OsmTilesState extends Record(initialState) {
  tiles: Map<string, any>;
}
const osmTilesState = new OsmTilesState();

export function osmReducer(state = osmTilesState, action: Action<any>) {
  switch (action.type) {
    case OSM_TILES.saveTile: {
      return state.setIn(['tiles', action.coords.join(',')], action.data);
    }
    default:
      return state;
  }
}
var win: any = window;
win.Record = Record;
