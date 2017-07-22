import { Map } from 'immutable';
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
  yield all([call(watchFetch), call(watchUpdateSources)]);
}
function* watchFetch(): SagaIterator {
  let tasks = [];
  while (true) {
    const { xys, zoom }: GetOSMTilesAction = yield take(OSM_TILES.get);
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
  const tasks = [];
  const PARTITION = 2;
  const partitions = Map();
  while (true) {
    const { data, dirtyMapAccess }: UpdateSourcesAction = yield take(
      MAP.updateSources
    );
    yield tasks.map(task => cancel(task));
    // const newPartitions = data.groupBy(
    //   v => parseInt(v.get('id').slice(1), 10) % PARTITION
    // );
    // console.log(newPartitions.keySeq().toArray());
    // // console.log('h', newPartitions.get(0).intersect(newPartitions.get(1)));
    // for (let i = 0; i < PARTITION - 1; i++) {
    tasks[0] = yield fork(updateSourceSaga, dirtyMapAccess, data, 0);
    // }
  }
}

function* updateSourceSaga(dirtyMapAccess, data: Entities, sourceId) {
  const nodes = data.toArray().filter(f => f instanceof Node).map(nodeToFeat);
  const source = yield call(dirtyMapAccess, map =>
    map.getSource(getSourceName(sourceId))
  );

  if (source) {
    yield call([source, 'setData'], turf.featureCollection(nodes));
  } else {
    yield call(dirtyMapAccess, map => {
      map.addSource(getSourceName(sourceId), {
        type: 'geojson',
        data: turf.featureCollection(nodes) // someFC().data
      });
      map.addLayer(someLayer(getSourceName(sourceId)));
    });
  }
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
      'circle-radius': 3,
      'circle-color': '#E80C7A',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    },
    filter: ['==', '$type', 'Point']
  };
}
