import { all, call } from 'redux-saga/effects';

import { watchDraw } from 'store/draw/draw.sagas';
import { watchOSMTiles } from 'store/map/sagas';

export function* rootSaga() {
  yield all([call(watchOSMTiles), call(watchDraw)]);
}
