import { getEntities } from 'idly-graph/lib/operations/getEntities';
import { getMap } from 'idly-graph/lib/operations/getMap';

import { getFeaturesOfEntityIds } from 'idly-graph/lib/operations/getFeaturesOfEntityIds';
import { setOsmTiles } from 'idly-graph/lib/operations/setOsmTiles';

import * as MyWorker from 'worker-loader!worker/worker';

const PromiseWorker = require('promise-worker');

export const worker: Worker = new MyWorker();
export const promiseWorker = new PromiseWorker(worker);

export const workerFetchMap = getMap(promiseWorker);

export const workerSetOsmTiles = setOsmTiles(promiseWorker);

export const workerGetEntities = getEntities(promiseWorker);

export const workerGetFeaturesOfEntityIds = getFeaturesOfEntityIds(
  promiseWorker
);
