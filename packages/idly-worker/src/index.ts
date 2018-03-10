import { stateCreate, stateShred } from 'idly-state/lib/index';
import operations from './operations';
import { OperationTypes, WorkerState } from './operations/operationsTypes';

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
  }
  return Promise.resolve({ state });
}

self.history = [];

export function workerRelay(
  prevState?: WorkerState,
  debug?: boolean
): (message: any) => Promise<any> {
  let state = {
    ...(prevState || DEFAULT_STATE),
  };

  return async message => {
    self.history.push({ message });
    return getStateController(state, message)
      .then(r => {
        state = r.state;
        self.state = state;
        self.osmState = r.state.osmState;
        self.message = r.message;
        self.response = r.response;

        self.makeBlock = () => (self.block = !self.block);
        self.shrink = () =>
          (self.state.osmState = stateShred(self.state.osmState));
        self.history[self.history.length - 1].response = r.response;
        return JSON.stringify(r.response);
      })
      .catch(e => {
        console.error(e);
        return Promise.reject(e);
      });
  };
}
