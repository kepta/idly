import { Map, Record, Set } from 'immutable';
import { uniqWith } from 'ramda';

import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';
import { Action } from 'store/actions';
import { OSM_TILES } from 'store/osm_tiles/actions';
const initialState = {
  tiles: Map(),
  legacy: [],
  graph: Set()
};

export class OsmTilesState extends Record(initialState) {
  public tiles: Map<string, any>;
  public graph: Set<Node | Way | Relation>;
  public legacy: any[];
  public set(k: string, v: any): OsmTilesState {
    return super.set(k, v) as OsmTilesState;
  }
}
const osmTilesState = new OsmTilesState();

export function osmReducer(state = osmTilesState, action: Action<any>) {
  switch (action.type) {
    case OSM_TILES.saveTile: {
      let newState = state.setIn(
        ['tiles', action.coords.join(',')],
        action.data
      );
      newState = newState.update('graph', graph => graph.union(action.data));
      return newState;
    }
    default:
      return state;
  }
}
const win: any = window;
win.Record = Record;
