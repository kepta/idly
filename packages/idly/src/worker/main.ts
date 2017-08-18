import * as MyWorker from 'worker-loader!worker/my-worker';

export const worker: Worker = new MyWorker();
