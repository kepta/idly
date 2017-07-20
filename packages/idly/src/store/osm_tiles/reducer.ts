import { Map, Record } from 'immutable';
import { uniqWith } from 'ramda';
import { Action } from 'src/store/actions';
import { OSM_TILES } from 'src/store/osm_tiles/actions';
const initialState = {
  tiles: Map(),
  legacy: []
};

export class OsmTilesState extends Record(initialState) {
  public tiles: Map<string, any>;
  public legacy: any[];
}
const osmTilesState = new OsmTilesState();

export function osmReducer(state = osmTilesState, action: Action<any>) {
  switch (action.type) {
    case OSM_TILES.saveTile: {
      const newState = state.setIn(
        ['tiles', action.coords.join(',')],
        action.data
      ) as OsmTilesState;
      return newState;
    }
    default:
      return state;
  }
}
const win: any = window;
win.Record = Record;
