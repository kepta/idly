import { pluginsStub } from '../../lib/misc/pluginsStub';
import { operations } from '../operations/operations';
import { GetActionTypes } from '../operations/operationsTypes';

export class PromiseWorkerStub {
  /* tslint:disable */
  public _workerCb: (message: GetActionTypes) => Promise<any>;
  registerPromiseWorker(workerCb: (message: GetActionTypes) => Promise<any>) {
    this._workerCb = workerCb;
  }
  /* tslint:enable */
  public postMessage(data: {
    readonly request: any;
    readonly type: string;
  }): Promise<any> {
    const t: GetActionTypes = JSON.parse(JSON.stringify(data));
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
  // tslint:disable-next-line:no-expression-statement
  promiseWorker.registerPromiseWorker(controller);
  return promiseWorker;
}
