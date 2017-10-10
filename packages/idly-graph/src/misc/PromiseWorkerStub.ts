import { WorkerActionsType } from '../operations/types';

export class PromiseWorkerStub {
  /* tslint:disable */
  public _workerCb: (message: WorkerActionsType) => Promise<any>;
  registerPromiseWorker(
    workerCb: (message: WorkerActionsType) => Promise<any>,
  ) {
    this._workerCb = workerCb;
  }
  /* tslint:enable */
  public postMessage(data: {
    readonly request: any;
    readonly type: string;
  }): Promise<any> {
    const t: WorkerActionsType = JSON.parse(JSON.stringify(data));
    if (!t.type) {
      throw new Error('need type');
    }
    if (!t.request) {
      throw new Error('need request');
    }
    return this._workerCb(t);
  }
}
