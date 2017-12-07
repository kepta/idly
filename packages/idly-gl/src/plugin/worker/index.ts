import { getEntities } from 'idly-graph/lib/operations/getEntities/main';
import { getFeaturesOfEntityIds } from 'idly-graph/lib/operations/getFeaturesOfEntityIds/main';
import { getFeaturesOfShrub } from 'idly-graph/lib/operations/getFeaturesOfShrub/main';
import { getMap } from 'idly-graph/lib/operations/getMap/main';
import { setOsmTiles } from 'idly-graph/lib/operations/setOsmTiles/main';
import { getBbox } from 'idly-graph/lib/operations/getBbox/main';

import * as MyWorker from './worker.worker';

const PromiseWorker = require('promise-worker');

export const worker: Worker = new MyWorker();
export const promiseWorker = new PromiseWorker(worker);

export const workerFetchMap = getMap(promiseWorker);

export const workerSetOsmTiles = setOsmTiles(promiseWorker);

export const workerGetEntities = getEntities(promiseWorker);
export const workerGetBbox = getBbox(promiseWorker);

export const workerGetFeaturesOfEntityIds = getFeaturesOfEntityIds(
  promiseWorker
);

export const workerGetFeaturesOfShrub = getFeaturesOfShrub(promiseWorker);
