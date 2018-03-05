import { operations } from '../index';
import { OperationTypes } from '../operations/operationsTypes';
import { pluginsStub } from './pluginsStub';

export class PromiseWorkerStub {
  /* tslint:disable */
  public _workerCb: (message: OperationTypes) => Promise<any>;
  registerPromiseWorker(workerCb: (message: OperationTypes) => Promise<any>) {
    this._workerCb = workerCb;
  }
  /* tslint:enable */
  public postMessage(data: {
    readonly request: any;
    readonly type: string;
  }): Promise<any> {
    const t: OperationTypes = JSON.parse(JSON.stringify(data));
    if (!t.type) {
      throw new Error('need type');
    }
    if (!t.request) {
      throw new Error('need request');
    }
    return this._workerCb(t);
  }
}

export function stubWorkerLogic(): PromiseWorkerStub {
  const promiseWorker = new PromiseWorkerStub();
  const controller = operations(pluginsStub());
  promiseWorker.registerPromiseWorker(controller);
  return promiseWorker;
}
