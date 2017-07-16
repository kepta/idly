import { call, all } from 'redux-saga/effects';

import { watchOSMTiles } from 'src/store/osm_tiles/sagas';

export function* rootSaga() {
  yield all([call(watchOSMTiles)]);
}
