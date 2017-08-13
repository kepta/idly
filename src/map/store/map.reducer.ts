/**
 * @ABOUT: reducer
 */
import { List, Map, OrderedMap, Record, Set } from 'immutable';

import { Entities } from 'osm/entities/entities';

import {
  GetOSMTilesAction,
  OSM_TILES,
  UpdateSourcesAction
} from 'map/store/map.actions';

const initialState = {
  loadedTiles: Set(),
  existingEntities: Set(),
  tileData: OrderedMap()
};

type MapActions = GetOSMTilesAction | UpdateSourcesAction;

export class OsmTilesState extends (Record(initialState) as any) {
  // all the entities
  public existingEntities: Entities;
  // tileID vise entities
  public tileData: OrderedMap<string, Entities>;
  public loadedTiles: Set<string>;
  public set(k: string, v: {}): OsmTilesState {
    return super.set(k, v) as OsmTilesState;
  }
  public update(k: string, v: any): OsmTilesState {
    return super.update(k, v) as OsmTilesState;
  }
}
const osmTilesState = new OsmTilesState();

export function osmReducer(state = osmTilesState, action: any) {
  switch (action.type) {
    case OSM_TILES.mergeIds: {
      const { setEntities, tileId, toEvictId, toEvict } = action;
      let newState = state;

      if (toEvictId) {
        newState = newState.update('loadedTiles', loadedTiles =>
          loadedTiles.remove(toEvictId)
        );
      }

      const existingEntities = newState.get('existingEntities');

      /**
       * @NOTE so when we evict a bbox, all the stuff is deleted
       *  inside it, and also includes things outside it.
       *  so the solution is to remove the duplicates from
       *  the `setEntities` variable so that in future it doesn't
       *  remove anything which might be shared by other tiles.
       *  to put it other way tileData only contains a Map of
       *  entities unique to that tile and not shared by any other tile.
      */
      newState = newState.update(
        'tileData',
        (tileData: OrderedMap<string, Entities>) => {
          let n = tileData.set(tileId, setEntities.subtract(existingEntities));
          if (toEvictId) {
            n = n.remove(toEvictId);
          }
          return n;
        }
      );

      return newState.update('existingEntities', (existing: Entities) => {
        let n = existing;
        if (toEvictId) {
          n = n.subtract(toEvict);
        }
        return n.merge(setEntities);
      });
    }
    case OSM_TILES.errorSaveTile:
    case OSM_TILES.saveTile: {
      const { tileId, loaded } = action;
      if (loaded)
        return state.update('loadedTiles', loadedTiles =>
          loadedTiles.add(tileId)
        );
      else {
        return state.update('loadedTiles', loadedTiles =>
          loadedTiles.remove(tileId)
        );
      }
    }
    default:
      return state;
  }
}
