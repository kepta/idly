import * as registerPromiseWorker from 'promise-worker/register';

registerPromiseWorker(function(message) {
  console.log(message);
  return 'pong';
});
