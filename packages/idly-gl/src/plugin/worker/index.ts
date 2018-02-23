import { getMoveNode } from 'idly-worker/lib/operations/getMoveNode/main';
import { GetMoveNode } from 'idly-worker/lib/operations/getMoveNode/type';

import { Operation } from 'idly-worker/lib/operations/operationsTypes';
import { setMovePointEntry } from 'idly-worker/lib/operations/setMovePointEntry/main';

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
