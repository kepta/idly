import { Feature } from 'idly-common/lib/osm/feature';
import { EntityType } from 'idly-common/lib/osm/structures';
import {
  WorkerActions,
  WorkerActionsType,
  WorkerFetchMap,
  WorkerGetEntities,
  WorkerGetFeatures
} from 'idly-worker/lib/actions';
import * as MyWorker from 'worker-loader!worker/my-worker';
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

export const workerFetchMap = builder<WorkerFetchMap>()(
  WorkerActions.FETCH_MAP
);

export const workerGetEntities = builder<WorkerGetEntities>()(
  WorkerActions.GET_VIRGIN_ENTITIES
);

export const workerGetFeatures = builder<WorkerGetFeatures>()(
  WorkerActions.GET_VIRGIN_FEATURES
);
