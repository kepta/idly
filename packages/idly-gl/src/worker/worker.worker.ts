import { workerRelay } from 'idly-worker/lib/workerRelay';
// @ts-ignore
import * as registerPromiseWorker from 'promise-worker/register';
registerPromiseWorker(workerRelay());
