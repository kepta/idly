import * as registerPromiseWorker from 'promise-worker/register';

import { operations } from 'idly-worker/lib/operations/operations';
// @ts-ignore
registerPromiseWorker(
  operations(
    Promise.resolve({
      workers: [],
    }),
    undefined,
    false
  )
);
