import { Map, Record, Set } from 'immutable';
import { uniqWith } from 'ramda';

import { Entities } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

import { Graph, graphFactory } from 'osm/history/graph';
import { graphRemoveEntities, graphSetEntities } from 'osm/history/helpers';

import { Action } from 'store/actions';
import {
  GetOSMTilesAction,
  OSM_TILES,
  UpdateSourcesAction
} from 'store/map/actions';

const initialState = {
  tiles: Map()
};
type MapActions = GetOSMTilesAction | UpdateSourcesAction;

export class OsmTilesState extends Record(initialState) {
  public tiles: Map<string, any>;
  public set(k: string, v: any): OsmTilesState {
    return super.set(k, v) as OsmTilesState;
  }
}
const osmTilesState = new OsmTilesState();

export function osmReducer(state = osmTilesState, action: Action<any>) {
  switch (action.type) {
    case OSM_TILES.saveTile: {
      const { data } = action as UpdateSourcesAction;
      return state.setIn(['tiles', action.coords.join(',')], action.data);
    }
    default:
      return state;
  }
}
