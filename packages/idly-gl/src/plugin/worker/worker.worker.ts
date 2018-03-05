import * as registerPromiseWorker from 'promise-worker/register';

import { workerRelay } from 'idly-worker/lib/index';
// @ts-ignore
registerPromiseWorker(workerRelay());
