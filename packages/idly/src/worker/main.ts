import { fetchEntities } from 'idly-graph/lib/operations/fetchEntities';
import { fetchMap } from 'idly-graph/lib/operations/fetchMap';

import { fetchFeatures } from 'idly-graph/lib/operations/fetchFeatures';
import * as MyWorker from 'worker-loader!worker/worker';
import {
  WorkerActions,
  WorkerActionsType,
  WorkerFetchMap,
  WorkerGetEntities,
  WorkerGetFeatures
} from 'worker/actions';

const PromiseWorker = require('promise-worker');

export const worker: Worker = new MyWorker();
export const promiseWorker = new PromiseWorker(worker);

function builder<W extends WorkerActionsType>() {
  return function(type: W['type']) {
    return function(request: W['request']): Promise<W['response']> {
      const toSend = {
        type,
        request,
        response: undefined
      };
      return promiseWorker.postMessage(toSend).then(r => r.response);
    };
  };
}

export const workerFetchMap = fetchMap(promiseWorker);

export const workerGetEntities = fetchEntities(promiseWorker);

export const workerGetFeatures = fetchFeatures(promiseWorker);
