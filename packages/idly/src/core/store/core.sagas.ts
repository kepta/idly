import { WorkerGetFeatures } from 'idly-worker/lib/actions';
import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { workerGetFeatures } from '../../worker/main';
import { workerSendSaga } from '../../worker/workermessenger';

import {
  WorkerGetEntities,
  workerGetEntitiesAction
} from 'idly-common/lib/actions/worker';
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
  console.log('here2');
  const {
    features
  }: WorkerGetFeatures['response'] = yield call(workerGetFeatures, {
    entitiesId
  });

  yield put(selectCommitAction(features));

  // const { response }: WorkerGetEntities = yield call(workerSendSaga, forWorker);
}
