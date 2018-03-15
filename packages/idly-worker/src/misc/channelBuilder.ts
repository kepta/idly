import { MainOperation } from '../operations/helpers';
import { OperationKinds, OperationTypes } from '../operations/types';

/**
 * A wrapper around `promiseWorker.postMessage` api
 * its sole purpose is to provide typings and easier testing
 * the main <-> worker calls.
 * @param promiseWorker
 */
export function getChannelBuilder<T extends OperationTypes>(promiseWorker: {
  readonly postMessage: any;
}): (type: T['type']) => (request: T['request']) => Promise<string> {
  return type => request => {
    const toSend = {
      request,
      type,
    };
    return promiseWorker.postMessage(toSend).catch((e: Error) => {
      // tslint:disable-next-line:no-console
      console.log('Worker Error', e.message);
      return Promise.reject(e.message);
    });
  };
}

export function parseResponse<T extends OperationTypes>(
  connector: any,
  operation: OperationKinds
): MainOperation<T> {
  const channel = getChannelBuilder<T>(connector)(operation);
  return async req => {
    const json = await channel(req);
    const fc: T['response'] = JSON.parse(json);
    return fc;
  };
}
