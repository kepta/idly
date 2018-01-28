import { getEntities } from 'idly-worker/lib/operations/getEntities/main';
import { getFeaturesOfEntityIds } from 'idly-worker/lib/operations/getFeaturesOfEntityIds/main';
import { getFeaturesOfShrub } from 'idly-worker/lib/operations/getFeaturesOfShrub/main';
import { getMap } from 'idly-worker/lib/operations/getMap/main';
import { setOsmTiles } from 'idly-worker/lib/operations/setOsmTiles/main';
import { getBbox } from 'idly-worker/lib/operations/getBbox/main';
import { Operation } from 'idly-worker/lib/operations/operationsTypes';
import { GetFeaturesOfShrub } from 'idly-worker/lib/operations/getFeaturesOfShrub/type';
import { GetFeaturesOfEntityIds } from 'idly-worker/lib/operations/getFeaturesOfEntityIds/type';
import { GetBbox } from 'idly-worker/lib/operations/getBbox/type';
import { GetEntities } from 'idly-worker/lib/operations/getEntities/type';
import { GetMap } from 'idly-worker/lib/operations/getMap/type';

import * as MyWorker from './worker.worker';

const PromiseWorker = require('promise-worker');
// @ts-ignore
export const worker: Worker = new MyWorker();

export const promiseWorker = new PromiseWorker(worker);

export const workerFetchMap: Operation<GetMap> = getMap(promiseWorker);

export const workerSetOsmTiles = setOsmTiles(promiseWorker);

export const workerGetEntities: Operation<GetEntities> = getEntities(
  promiseWorker
);

export const workerGetBbox: Operation<GetBbox> = getBbox(promiseWorker);

export const workerGetFeaturesOfEntityIds: Operation<
  GetFeaturesOfEntityIds
> = getFeaturesOfEntityIds(promiseWorker);

export const workerGetFeaturesOfShrub: Operation<
  GetFeaturesOfShrub
> = getFeaturesOfShrub(promiseWorker);
