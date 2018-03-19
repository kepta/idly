import { stateGetEntity } from 'idly-state/lib';
import { WorkerOperation, WorkerState } from '../helpers';
import { GetEntity } from './type';

export function workerGetEntity(
  state: WorkerState
): WorkerOperation<GetEntity> {
  return async ({ id }) => {
    return {
      response: stateGetEntity(state.osmState, id),
      state,
    };
  };
}
