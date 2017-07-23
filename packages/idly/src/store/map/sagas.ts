import { Map } from 'immutable';
import { LngLatBounds } from 'mapbox-gl';
import { buffers, delay, Effect, Pattern, SagaIterator } from 'redux-saga';
import {
  actionChannel,
  all,
  call,
  cancel,
  cancelled,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';
import { bboxPolygon, featureCollection } from 'turf';

import { ZOOM } from 'map/map';
import { nodeToFeat } from 'map/nodeToFeat';
import { cancelablePromise } from 'network/helper';
import { fetchTile } from 'network/osm';
import { Entities } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { IRootStateType } from 'store/';
import { action, Action } from 'store/actions';
import { CORE } from 'store/core/core.actions';
import {
  GetOSMTilesAction,
  MAP,
  OSM_TILES,
  UpdateSourcesAction
} from 'store/map/actions';

const SphericalMercator = require('@mapbox/sphericalmercator');

const mercator = new SphericalMercator({
  size: 256
});

export function* watchOSMTiles(): SagaIterator {
  // yield all([takeLatest<Action<GetOSMTilesType>>(OSM_TILES.get, fetchSaga)]);
  yield all([
    call(watchFetch),
    call(watchUpdateSources),
    takeLatest<UpdateSourcesAction>(MAP.hideEntities, hideEntitiesSaga)
  ]);
}
function* watchFetch(): SagaIterator {
  const takeChan = yield actionChannel(OSM_TILES.get, buffers.sliding(1));

  while (true) {
    const { xys, zoom }: GetOSMTilesAction = yield take(takeChan);
    if (zoom < ZOOM) continue;
    yield all(xys.map(([x, y]) => fork(fetchTileSaga, x, y, zoom)));
  }
}

function* fetchTileSaga(x: number, y: number, zoom: number) {
  try {
    const tiles = yield select((state: IRootStateType) =>
      state.osmTiles.getIn(['tiles', [x, y, zoom].join(',')])
    );
    if (tiles) {
      return;
    }
    const dataAsJSON = yield call(fetchTile, x, y, zoom);
    yield put(
      action(OSM_TILES.saveTile, {
        coords: [x, y, zoom],
        data: dataAsJSON.map(d => d.id)
      })
    );
    yield put(
      action(CORE.newData, {
        data: dataAsJSON
      })
    );
  } catch (e) {
    console.error(e);
  } finally {
    if (yield cancelled()) {
      console.log('canceled');
    }
  }
}

function* watchUpdateSources(): SagaIterator {
  // NOTE: fix sliding buffer if we move away from
  // all update.
  const requestChan = yield actionChannel(
    MAP.updateSources,
    buffers.sliding(1)
  );
  while (true) {
    // 2- take from the channel
    const { data, dirtyMapAccess, sourceId }: UpdateSourcesAction = yield take(
      requestChan
    );
    // 3- Note that we're using a blocking call
    yield call(updateSourceSaga, dirtyMapAccess, data, sourceId);
    yield call(delay, 300);
  }
}

function* updateSourceSaga(dirtyMapAccess, data: Entities, sourceId) {
  const nodes = data.toArray().filter(f => f instanceof Node).map(nodeToFeat);
  const source = yield call(dirtyMapAccess, map => map.getSource(sourceId));

  if (source) {
    console.log('updating source');
    yield call([source, 'setData'], turf.featureCollection(nodes));
  } else {
    console.log('soruce not foud');
  }
}

function* hideEntitiesSaga({
  dirtyMapAccess,
  data,
  layerId
}: {
  dirtyMapAccess: (map: any) => void;
  data: Entities;
  layerId: string;
}): SagaIterator {
  yield call(dirtyMapAccess, map => {
    map.setFilter('park-volcanoes', [
      '!in',
      'id',
      ...data.map(f => f.id).toArray()
    ]);
  });
}

function getSourceName(sourceId) {
  return `source-${sourceId}`;
}

function someLayer(sourceName) {
  return {
    id: 'park-volcanoes',
    type: 'circle',
    source: sourceName,
    paint: {
      'circle-radius': 4,
      'circle-color': '#E80C7A',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    },
    filter: ['==', '$type', 'Point']
  };
}
