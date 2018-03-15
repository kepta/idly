import Operations, { WorkerType } from 'idly-worker/lib/index';
// tslint:disable-next-line:no-var-requires
const PromiseWorker = require('promise-worker');

import * as MyWorker from './worker.worker';
// @ts-ignore
export const worker = new MyWorker();

export const promiseWorker = new PromiseWorker(worker);

export const workerOperations: WorkerType = Operations(promiseWorker);
