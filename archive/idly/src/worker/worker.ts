import * as turfHelpers from '@turf/helpers';
import { plugins } from 'plugins';
import registerPromiseWorker from 'promise-worker/register';

import { operations } from 'idly-graph/lib/operations/operations';

registerPromiseWorker(operations(plugins));
