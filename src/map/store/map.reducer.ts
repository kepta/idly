/**
 * @ABOUT: reducer
 */
import { Map, Record, Set } from 'immutable';
import { uniqWith } from 'ramda';

import { Action } from 'common/actions';
import { mergeIds } from 'core/tileOperations';
import { Entities, EntitiesId } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';
import { Graph, graphFactory } from 'osm/history/graph';
import { graphRemoveEntities, graphSetEntities } from 'osm/history/helpers';

import {
  GetOSMTilesAction,
  OSM_TILES,
  UpdateSourcesAction
} from 'map/store/map.actions';

const initialState = {
  tiles: Map(),
  loadedTiles: Set(),
  existingIds: Set()
};

type MapActions = GetOSMTilesAction | UpdateSourcesAction;

export class OsmTilesState extends Record(initialState) {
  public tiles: Map<string, {}>;
  public existingIds: EntitiesId;
  public loadedTiles: Set<string>;
  public set(k: string, v: {}): OsmTilesState {
    return super.set(k, v) as OsmTilesState;
  }
}
const osmTilesState = new OsmTilesState();

export function osmReducer(state = osmTilesState, action: any) {
  switch (action.type) {
    case OSM_TILES.mergeIds: {
      const { newData } = action;
      return state.update('existingIds', existingIds =>
        mergeIds(existingIds, newData)
      );
    }
    case OSM_TILES.errorSaveTile:
    case OSM_TILES.saveTile: {
      const { coords } = action;
      return state.update('loadedTiles', loadedTiles =>
        loadedTiles.add(coords.join(','))
      );
    }
    default:
      return state;
  }
}
