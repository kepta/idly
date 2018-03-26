import { workerRelay } from 'idly-worker/lib/workerRelay';
import * as registerPromiseWorker from 'promise-worker/register';
// @ts-ignore
registerPromiseWorker(workerRelay());
