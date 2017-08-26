import { store } from 'common/store';
import { call, take } from 'redux-saga/effects';
import { worker } from 'worker/main';

import {
  WorkerActions,
  WorkerActionsType
} from 'idly-common/lib/actions/worker';

export function workerDirectSend(action: WorkerActionsType) {
  worker.postMessage(JSON.stringify(action));
}

export function* workerSendSaga(action: WorkerActionsType) {
  const uid = Math.random().toString();
  action.uid = uid;
  yield call([worker, 'postMessage'], JSON.stringify(action));
  let response;
  while (!response) {
    const ret = yield take(action.type);
    if (ret.uid === uid) {
      response = ret;
    }
  }
  return response;
}

worker.addEventListener('message', event => {
  const dataStr: string = event.data;
  // hack: to avoid parsing map data
  if (dataStr.startsWith('{"type":"FeatureCollection","features":')) {
    return;
  }
  const data: WorkerActionsType = JSON.parse(dataStr);
  switch (data.type) {
    case WorkerActions.GET_VIRGIN_ENTITIES: {
      const { entitiesId, response } = data;
      store.dispatch(data);
    }
  }
});
