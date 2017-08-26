import { WorkerGetFeatures } from 'idly-worker/lib/actions';
import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { workerGetFeatures } from '../../worker/main';

import {
  SelectActions,
  selectCommitAction,
  SelectEntitiesAction
} from './core.actions';

export function* watchCore(): SagaIterator {
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
  yield put(selectCommitAction(features));
}
