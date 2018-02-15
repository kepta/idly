import { getBbox } from 'idly-worker/lib/operations/getBbox/main';
import { GetBbox } from 'idly-worker/lib/operations/getBbox/type';
import { getEntities } from 'idly-worker/lib/operations/getEntities/main';
import { GetEntities } from 'idly-worker/lib/operations/getEntities/type';
import { getFeaturesOfEntityIds } from 'idly-worker/lib/operations/getFeaturesOfEntityIds/main';
import { GetFeaturesOfEntityIds } from 'idly-worker/lib/operations/getFeaturesOfEntityIds/type';
import { getFeaturesOfShrub } from 'idly-worker/lib/operations/getFeaturesOfShrub/main';
import { GetFeaturesOfShrub } from 'idly-worker/lib/operations/getFeaturesOfShrub/type';
import { getMap } from 'idly-worker/lib/operations/getMap/main';
import { GetMap } from 'idly-worker/lib/operations/getMap/type';
import { getMoveNode } from 'idly-worker/lib/operations/getMoveNode/main';
import { GetMoveNode } from 'idly-worker/lib/operations/getMoveNode/type';

import { Operation } from 'idly-worker/lib/operations/operationsTypes';
import { setMovePointEntry } from 'idly-worker/lib/operations/setMovePointEntry/main';
import { setOsmTiles } from 'idly-worker/lib/operations/setOsmTiles/main';

import { getQuadkey } from 'idly-worker/lib/operations/getQuadkeys/main';
import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkeys/type';

import * as MyWorker from './worker.worker';

// tslint:disable-next-line:no-var-requires
const PromiseWorker = require('promise-worker');
// @ts-ignore
export const worker: Worker = new MyWorker();

export const promiseWorker = new PromiseWorker(worker);

export const workerGetQuadkeys: Operation<GetQuadkey> = getQuadkey(
  promiseWorker
);

export const workerGetMoveNode: Operation<GetMoveNode> = getMoveNode(
  promiseWorker
);
// export const workerFetchMap: Operation<GetMap> = getMap(promiseWorker);

// export const workerSetOsmTiles = setOsmTiles(promiseWorker);
export const workerSetMovePointEntry = setMovePointEntry(promiseWorker);

// export const workerGetEntities: Operation<GetEntities> = getEntities(
//   promiseWorker
// );

// export const workerGetBbox: Operation<GetBbox> = getBbox(promiseWorker);

// export const workerGetFeaturesOfEntityIds: Operation<
//   GetFeaturesOfEntityIds
// > = getFeaturesOfEntityIds(promiseWorker);

// export const workerGetFeaturesOfShrub: Operation<
//   GetFeaturesOfShrub
// > = getFeaturesOfShrub(promiseWorker);
