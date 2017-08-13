import * as PromiseWorker from 'promise-worker';
import * as MyWorker from 'worker-loader!worker/worker';

const worker: any = new PromiseWorker(new MyWorker());

worker
  .postMessage({
    type: 'en',
    d: { k: 1 },
    b: JSON.stringify({ c: 3, b: 4 })
  })
  .then(function(response) {
    // handle response
    console.log(response);
  })
  .catch(function(error) {
    // handle error
  });
