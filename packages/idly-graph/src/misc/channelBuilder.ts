import { GetActionTypes, WorkerSetStateActionsType } from '../operations/operationsTypes';

/**
 * A wrapper around `promiseWorker.postMessage` api
 * its sole purpose is to provide typings and easier testing
 * the main <-> worker calls.
 * @param promiseWorker
 */
export function getChannelBuilder<T extends GetActionTypes>(promiseWorker: {
  readonly postMessage: any;
}): (type: T['type']) => (request: T['request']) => Promise<string> {
  return type => {
    return request => {
      const toSend = {
        request,
        type,
      };
      return promiseWorker.postMessage(toSend).catch((e: Error) => {
        console.log('Worker Error', e.message);
        return Promise.reject(e.message);
      });
    };
  };
}

/**
 * A wrapper around `promiseWorker.postMessage` api
 * its sole purpose is to provide typings and easier testing
 * the main <-> worker calls.
 * @param promiseWorker
 */
export function setChannelBuilder<
  T extends WorkerSetStateActionsType
>(promiseWorker: {
  readonly postMessage: any;
}): (type: T['type']) => (request: T['request']) => Promise<string> {
  return type => {
    return request => {
      const toSend = {
        request,
        type,
      };
      return promiseWorker.postMessage(toSend).catch((e: Error) => {
        console.log('Worker Error', e.message);
        return Promise.reject(e.message);
      });
    };
  };
}
