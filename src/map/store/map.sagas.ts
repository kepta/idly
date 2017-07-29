/**
 * @ABOUT: sagas
 */
import { Map, Set } from 'immutable';
import { LngLatBounds } from 'mapbox-gl';
import { buffers, delay, SagaIterator } from 'redux-saga';
import * as S from 'redux-saga/effects';
import { bboxPolygon, featureCollection } from 'turf';

import { action, Action } from 'common/actions';
import { IRootStateType } from 'common/store';
import { CORE } from 'core/store/core.actions';
import { removeExisting } from 'core/tileOperations';
import { Entities } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Graph } from 'osm/history/graph';
import { fetchTile } from 'osm/network/fetchTile';
import { cancelablePromise } from 'utils/promise';

import { ZOOM } from 'map/map';
import { nodeToFeat } from 'map/utils/nodeToFeat';
import {
  GetOSMTilesAction,
  MAP,
  OSM_TILES,
  UpdateSourcesAction
} from 'map/store/map.actions';

// tslint:disable-next-line:
export function* watchOSMTiles(): SagaIterator {
  // yield all([takeLatest<Action<GetOSMTilesType>>(OSM_TILES.get, fetchSaga)]);
  yield S.all([S.call(watchFetch), S.call(watchUpdateSources)]);
}

function* watchFetch(): SagaIterator {
  const takeChan = yield S.actionChannel(OSM_TILES.get, buffers.sliding(1));

  while (true) {
    const { xys, zoom }: GetOSMTilesAction = yield S.take(takeChan);
    if (zoom < ZOOM) continue;
    yield S.all(xys.map(([x, y]) => S.fork(fetchTileSaga, x, y, zoom)));
  }
}

function* fetchTileSaga(x: number, y: number, zoom: number) {
  try {
    const tiles = yield S.select((state: IRootStateType) =>
      state.osmTiles.getIn(['tiles', [x, y, zoom].join(',')])
    );
    if (tiles) {
      return;
    }
    yield S.put(
      action(OSM_TILES.saveTile, {
        coords: [x, y, zoom],
        loaded: true
      })
    );
    const dataAsJSON = yield S.call(fetchTile, x, y, zoom);
    const existingIds = yield S.select(
      (state: IRootStateType) => state.osmTiles.existingIds
    );
    const newData = removeExisting(existingIds, dataAsJSON);
    yield S.put(
      action(OSM_TILES.mergeIds, {
        newData
      })
    );
    yield S.put(
      action(CORE.newData, {
        data: newData
      })
    );
  } catch (e) {
    console.error(e);
    yield S.put(
      action(OSM_TILES.errorSaveTile, {
        coords: [x, y, zoom],
        loaded: false
      })
    );
  } finally {
    if (yield S.cancelled()) {
      console.log('canceled');
    }
  }
}

function* watchUpdateSources(): SagaIterator {
  // NOTE: fix sliding buffer if we move away from
  // all update.
  const requestChan = yield S.actionChannel(
    MAP.updateSources,
    buffers.sliding(1)
  );
  while (true) {
    // 2- take from the channel
    const {
      data,
      dirtyMapAccess,
      sourceId
    }: UpdateSourcesAction = yield S.take(requestChan);
    // 3- Note that we're using a blocking call
    yield S.call(updateSourceSaga, dirtyMapAccess, data, sourceId);
    yield S.call(delay, 100);
  }
}

function* updateSourceSaga(dirtyMapAccess, data: Entities, sourceId) {
  const nodes = data.toArray().filter(f => f instanceof Node).map(nodeToFeat);

  const source = yield S.call(dirtyMapAccess, map => map.getSource(sourceId));

  if (source) {
    console.log('UPDATING source!', sourceId);
    yield S.call([source, 'setData'], turf.featureCollection(nodes));
  } else {
    console.log('source not foud');
  }
}
