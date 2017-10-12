import * as turfHelpers from '@turf/helpers';
import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';
import { Tree } from 'idly-graph/lib/graph/Tree';
import { plugins } from 'plugins';
import registerPromiseWorker from 'promise-worker/register';

import { operations } from 'idly-graph/lib/operations/operations';

registerPromiseWorker(operations(plugins));
