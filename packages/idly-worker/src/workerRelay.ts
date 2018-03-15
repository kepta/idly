import { stateCreate } from 'idly-state/lib/index';
import operations from './operations';
import { WorkerState } from './operations/helpers';
import { OperationTypes } from './operations/types';

const DEFAULT_STATE: WorkerState = {
  osmState: stateCreate(),
};

function getStateController(
  state: WorkerState,
  message: OperationTypes
): Promise<{ state: WorkerState; response?: any }> {
  const func = (operations as any)[message.type];
  if (func) {
    return func(state)(message.request);
  } else {
    return Promise.reject(new Error('No matching func found'));
  }
}

export function workerRelay(
  prevState?: WorkerState
): (message: any) => Promise<any> {
  let state = {
    ...(prevState || DEFAULT_STATE),
  };

  return async message => {
    return getStateController(state, message).then(r => {
      state = r.state;
      return JSON.stringify(r.response);
    });
  };
}
