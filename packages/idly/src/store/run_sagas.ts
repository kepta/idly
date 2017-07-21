import { all, call } from 'redux-saga/effects';

import { watchOSMTiles } from 'store/osm_tiles/sagas';

export function* rootSaga() {
  yield all([call(watchOSMTiles)]);
}
