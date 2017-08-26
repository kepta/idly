import { WorkerGetEntities, WorkerGetFeatures } from 'idly-worker/lib/actions';
import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { workerGetEntities, workerGetFeatures } from '../../worker/main';

import {
  SelectActions,
  selectCommitAction,
  SelectEntitiesAction
} from './select.actions';

export function* watchSelect(): SagaIterator {
  yield all([
    takeLatest<SelectEntitiesAction>(SelectActions.SELECT_ENTITIES, selectSaga)
  ]);
}

export function* selectSaga({ type, entitiesId }: SelectEntitiesAction) {
  const {
    features
  }: WorkerGetFeatures['response'] = yield call(workerGetFeatures, {
    entitiesId
  });
  const {
    entities
  }: WorkerGetEntities['response'] = yield call(workerGetEntities, {
    entitiesId
  });

  yield put(selectCommitAction(features, entities));
}
