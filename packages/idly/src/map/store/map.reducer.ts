/**
 * @ABOUT: reducer
 */
import { Map, Record, Set } from 'immutable';
import { uniqWith } from 'ramda';

import { Action } from 'common/actions';
import { EntitiesId } from 'core/coreOperations';
import { mergeIds } from 'core/tileOperations';
import { Entities } from 'osm/entities/entities';
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
  existingIds: Set()
};

type MapActions = GetOSMTilesAction | UpdateSourcesAction;

export class OsmTilesState extends Record(initialState) {
  public tiles: Map<string, {}>;
  public existingIds: EntitiesId;
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

      return state.setIn(['tiles', coords.join(',')], action.loaded);
    }
    default:
      return state;
  }
}
