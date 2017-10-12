import { fetchEntities } from 'idly-graph/lib/operations/fetchEntities';
import { fetchMap } from 'idly-graph/lib/operations/fetchMap';

import { fetchFeatures } from 'idly-graph/lib/operations/fetchFeatures';
import * as MyWorker from 'worker-loader!worker/worker';

const PromiseWorker = require('promise-worker');

export const worker: Worker = new MyWorker();
export const promiseWorker = new PromiseWorker(worker);

export const workerFetchMap = fetchMap(promiseWorker);

export const workerGetEntities = fetchEntities(promiseWorker);

export const workerGetFeatures = fetchFeatures(promiseWorker);
