import * as registerPromiseWorker from 'promise-worker/register';

import { operations } from 'idly-graph/lib/operations/operations';

registerPromiseWorker(
  operations(
    Promise.resolve({
      workers: []
    }),
    undefined,
    false
  )
);
