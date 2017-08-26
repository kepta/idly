/**
 * @ABOUT: sagas
 */
import { buffers, delay, SagaIterator } from 'redux-saga';
import * as S from 'redux-saga/effects';

import { Set as $Set } from 'immutable';

import { ZOOM } from 'map/constants';
import {
  GetOSMTilesAction,
  MAP,
  OSM_TILES,
  UpdateSourcesAction
} from 'map/store/map.actions';

import { getFromWindow } from 'utils/attach_to_window';
import { worker } from 'worker/main';

const TILE_STORAGE = 105000;

// tslint:disable-next-line:
export function* watchOSMTiles(): SagaIterator {
  // yield all([takeLatest<Action<GetOSMTilesType>>(OSM_TILES.get, fetchSaga)]);
  yield S.all([S.call(watchFetch), S.call(watchUpdateSources)]);
}

function* watchFetch() {
  const takeChan = yield S.actionChannel(OSM_TILES.get, buffers.sliding(1));

  while (true) {
    const { xys, zoom }: GetOSMTilesAction = yield S.take(takeChan);
    if (zoom < ZOOM) continue;
    if (getFromWindow('disableTile')) continue;
    yield S.all(xys.map(([x, y]) => S.fork(fetchTileSaga, x, y, zoom)));
    yield delay(150);
  }
}

function* fetchTileSaga(x: number, y: number, zoom: number) {
  // x = 32764;
  // y = 21791;
  // zoom = 16;
  worker.postMessage([x, y, zoom].join(','));
  // try {
  //   const hasTiles = yield S.select((state: IRootStateType) =>
  //     state.osmTiles.get('loadedTiles').has(tileId)
  //   );
  //   if (hasTiles) {
  //     return;
  //   }

  //   yield S.put(
  //     action(OSM_TILES.saveTile, {
  //       tileId,
  //       loaded: true
  //     })
  //   );
  //   console.log('sending', x, y, zoom);
  // const xml = yield S.call(fetchTile, x, y, zoom);
  // const [oldParentWays, tileData]: [
  //   ParentWays,
  //   OrderedMap<string, Entities>
  // ] = yield S.select((state: IRootStateType) => [
  //   state.core.parentWays,
  //   state.osmTiles.tileData
  // ]);
  // let toEvict: Entities = Set();
  // let toEvictId: string;
  // console.time('parser' + tileId);
  // const { entities, parentWays } = parseXML(xml, oldParentWays);
  // console.timeEnd('parser' + tileId);
  // const setEntities = Set(entities);
  // const existingEntities: Entities = yield S.select(
  //   (state: IRootStateType) => state.osmTiles.existingEntities
  // );
  // if (existingEntities.size > TILE_STORAGE) {
  //   toEvict = tileData.first();
  //   toEvictId = tileData.keySeq().first();
  // }
  // const newData = setEntities.subtract(existingEntities);

  // yield S.put(coreVirginModify(newData, toEvict, parentWays));
  // yield S.put(
  //   action(OSM_TILES.mergeIds, {
  //     tileId,
  //     setEntities,
  //     toEvict,
  //     toEvictId
  //   })
  // );
  // } catch (e) {
  //   console.error(e);
  //   yield S.put(
  //     action(OSM_TILES.errorSaveTile, {
  //       tileId,
  //       loaded: false
  //     })
  //   );
  // } finally {
  //   if (yield S.cancelled()) {
  //     console.log('canceled');
  //   }
  // }
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

function* setViriginMapData(dirtyMapAccess, data: string) {
  const source = yield S.call(dirtyMapAccess, map => map.getSource('virgin'));
  console.log('UPDATING virgin!');
  yield S.call([source, 'setData'], data);
}

function* updateSourceSaga(dirtyMapAccess, data: $Set<any>, sourceId) {
  //   console.time('updateSourceSaga');
  //   const [graph, parentWays]: [
  //     Graph,
  //     ParentWays
  //   ] = yield S.select((state: IRootStateType) => [
  //     state.core.graph,
  //     state.core.parentWays
  //   ]);
  //   // console.time('toJSON');
  //   // stringifiers(data);
  //   // stringifiers(Graph);
  //   // console.timeEnd('toJSON');
  //   console.time('updateSourceSaga');
  //   // const entities = data
  //   //   .toArray()
  //   //   .map(e => {
  //   //     if (instanceOfClass(e, 'Node')) {
  //   //       // return nodeCombiner(e, parentWays, presetsMatcher);
  //   //       return nodeCombiner(e, parentWays);
  //   //     } else if (instanceOfClass(e, 'Way')) {
  //   //       return wayCombiner(e, graph);
  //   //     }
  //   //   })
  //   //   .filter(f => f);
  //   console.timeEnd('updateSourceSaga');
  //   // window.mainEntities = entities;
  // const source = yield S.call(dirtyMapAccess, map => map.getSource(sourceId));
  // if (source) {
  //   console.log('UPDATING source!', sourceId);
  //   yield S.call([source, 'setData'], turf.featureCollection(entities));
  // } else {
  //   console.log('source not found');
  // }
}
