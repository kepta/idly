import * as MyWorker from 'worker-loader!worker/worker';
const worker: Worker = new MyWorker();
worker.postMessage({ a: 1 });
worker.onmessage = function(event) {
  console.log(arguments);
};
worker.addEventListener('message', function(event) {
  console.log(arguments);
});
