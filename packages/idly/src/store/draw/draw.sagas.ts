import { nodeToFeat } from 'map/nodeToFeat';
import { getTypeFromID } from 'osm/misc';
import { SagaIterator } from 'redux-saga';
import { all, put, select, takeLatest } from 'redux-saga/effects';
import { IRootStateType } from 'store';
import { Action, action } from 'store/actions';
import { removeEntitiesById } from 'store/core/core.actions';
import { DRAW, IDrawSelect } from 'store/draw/draw.actions';

export function* watchDraw(): SagaIterator {
  yield all([takeLatest<Action<IDrawSelect>>(DRAW.selectFeatures, selectSaga)]);
  //   yield all([call(watchFetch)]);
}

export function* selectSaga({ type, features }: Action<IDrawSelect>) {
  const node = yield select((state: IRootStateType) =>
    state.core.graph.getIn([
      getTypeFromID(features[0].properties.id),
      features[0].properties.id
    ])
  );
  yield put(
    action(DRAW.updateSelection, {
      selectedFeatures: [nodeToFeat(node)]
    })
  );
  yield put(removeEntitiesById(features.map(f => f.properties.id)));
}
