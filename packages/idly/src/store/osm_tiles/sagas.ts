import { LngLatBounds } from 'mapbox-gl';
import { Effect, Pattern, SagaIterator } from 'redux-saga';
import {
  all,
  call,
  cancel,
  cancelled,
  fork,
  put,
  select,
  take,
  takeLatest
} from 'redux-saga/effects';
import { bboxPolygon, featureCollection } from 'turf';

import { ZOOM } from 'src/map/init';
import { cancelablePromise } from 'src/network/helper';
import { fetchTile } from 'src/network/osm';
import { IRootStateType } from 'src/store/';
import { action, Action } from 'src/store/actions';
import { IGetOSMTilesType, OSM_TILES } from 'src/store/osm_tiles/actions';

const SphericalMercator = require('@mapbox/sphericalmercator');

const mercator = new SphericalMercator({
  size: 256
});

export function* watchOSMTiles(): SagaIterator {
  // yield all([takeLatest<Action<GetOSMTilesType>>(OSM_TILES.get, fetchSaga)]);
  yield all([call(watchFetch)]);
}
function* watchFetch(): SagaIterator {
  let tasks = [];
  while (true) {
    const { xys, zoom }: Action<IGetOSMTilesType> = yield take(OSM_TILES.get);
    if (zoom < ZOOM) continue;
    yield tasks.map(task => cancel(task));
    tasks = yield xys.map(([x, y]) => fork(fetchTileSaga, x, y, zoom));
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
