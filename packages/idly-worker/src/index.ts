import * as MyWorker from 'worker-loader?inline!./worker.ts';

export const worker: Worker = MyWorker;
//
import { fetchTile } from 'parsing/fetch';
export default fetchTile;
// export { parseXML } from 'parsing/parser';

// window.fetchtile = (x, y, z) => {
//   console.time('magic');
//   worker.postMessage([x, y, z].join(','));
// };
// // worker.onmessage = function(event) {...};
// worker.addEventListener('message', function(event) {
//   console.time('parse1');
//   console.log(JSON.parse(event.data));
//   console.timeEnd('parse1');

//   console.timeEnd('magic');
// });

// export fetchTile
