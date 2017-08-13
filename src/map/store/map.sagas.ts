/**
 * @ABOUT: sagas
 */
import { Set } from 'immutable';
import { buffers, delay, SagaIterator } from 'redux-saga';
import * as S from 'redux-saga/effects';

import { action } from 'common/actions';
import { IRootStateType } from 'common/store';
import { coreVirginAdd } from 'core/store/core.actions';
import { removeExisting } from 'core/tileOperations';
import { Entities } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Way } from 'osm/entities/way';
import { fetchTile } from 'osm/network/fetchTile';

import { ZOOM } from 'map/constants';
import {
  GetOSMTilesAction,
  MAP,
  OSM_TILES,
  UpdateSourcesAction
} from 'map/store/map.actions';
import { nodeToFeat } from 'map/utils/nodeToFeat';
import { wayToFeat } from 'map/utils/wayToFeat';

import { Graph } from 'osm/history/graph';
import { parseXML } from 'osm/parsers/parsers';
import { getFromWindow } from 'utils/attach_to_window';

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
    if (getFromWindow('disableTile')) continue;
    yield S.all(xys.map(([x, y]) => S.fork(fetchTileSaga, x, y, zoom)));
  }
}

function* fetchTileSaga(x: number, y: number, zoom: number) {
  try {
    const hasTiles = yield S.select((state: IRootStateType) =>
      state.osmTiles.get('loadedTiles').has([x, y, zoom].join(','))
    );
    if (hasTiles) {
      return;
    }
    yield S.put(
      action(OSM_TILES.saveTile, {
        coords: [x, y, zoom],
        loaded: true
      })
    );
    const xml = yield S.call(fetchTile, x, y, zoom);
    const oldParentWays = yield S.select(
      (state: IRootStateType) => state.core.parentWays
    );
    console.time('parser' + [x, y, zoom].join(','));
    const { entities, parentWays } = parseXML(xml, oldParentWays);
    const setEntities = Set(entities);
    const existingEntities: Entities = yield S.select(
      (state: IRootStateType) => state.osmTiles.existingEntities
    );
    const newData = setEntities.subtract(existingEntities);
    console.timeEnd('parser' + [x, y, zoom].join(','));
    yield S.put(coreVirginAdd(newData, parentWays));
    yield S.put(
      action(OSM_TILES.mergeIds, {
        newData
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
    yield S.call(delay, 200);
  }
}

function* updateSourceSaga(dirtyMapAccess, data: Entities, sourceId) {
  console.time('updateSourceSaga');

  const graph: Graph = yield S.select(
    (state: IRootStateType) => state.core.graph
  );
  const entities = data
    .toArray()
    .map(e => {
      if (e instanceof Node) {
        return nodeToFeat(e);
      } else if (e instanceof Way) {
        return wayToFeat(e, graph);
      }
    })
    .filter(f => f);

  console.timeEnd('updateSourceSaga');

  const source = yield S.call(dirtyMapAccess, map => map.getSource(sourceId));

  if (source) {
    console.log('UPDATING source!', sourceId);
    yield S.call([source, 'setData'], turf.featureCollection(entities));
  } else {
    console.log('source not found');
  }
}
