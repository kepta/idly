import { plugins } from 'plugins';

import registerPromiseWorker from 'promise-worker/register';
import { main } from 'worker/worker';

registerPromiseWorker(main(plugins));
