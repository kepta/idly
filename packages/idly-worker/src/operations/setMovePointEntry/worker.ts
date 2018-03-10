import { nodeMove } from 'idly-state/lib/editing/nodeMove';
import {
  stateAddModified,
  stateGenNextId,
  stateGetEntity,
} from 'idly-state/lib/index';

import { WorkerOperation, WorkerState } from '../operationsTypes';
import { SetMovePointEntry } from './type';

/** Worker Thread */

export function workerSetMovePointEntry(
  state: WorkerState
): WorkerOperation<SetMovePointEntry> {
  return async ({ entity }) => {
    return {
      response: undefined,
      state: {
        ...state,
      },
    };
  };
}
