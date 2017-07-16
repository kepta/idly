import { call, all, takeLatest } from 'redux-saga/effects';
import { SagaIterator, Effect } from 'redux-saga';
import { OSM_TILES } from 'src/store/osm_tiles/actions';
export function* watchOSMTiles(): SagaIterator {
  yield all([takeLatest(OSM_TILES.fetch, fetchSaga)]);
}

function* fetchSaga(pay: any): SagaIterator {
  console.log(pay);
}
