import { plugins } from 'plugins';

import { main } from 'idly-worker/lib/worker';
import registerPromiseWorker from 'promise-worker/register';

registerPromiseWorker(main(plugins));
