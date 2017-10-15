import { WorkerGetStateActionsType } from '../operations/types';

// TOFIX WorkerGetStateActionsType only does GetState actions, want to add SetState aswell
export class PromiseWorkerStub {
  /* tslint:disable */
  public _workerCb: (message: WorkerGetStateActionsType) => Promise<any>;
  registerPromiseWorker(
    workerCb: (message: WorkerGetStateActionsType) => Promise<any>,
  ) {
    this._workerCb = workerCb;
  }
  /* tslint:enable */
  public postMessage(data: {
    readonly request: any;
    readonly type: string;
  }): Promise<any> {
    const t: WorkerGetStateActionsType = JSON.parse(JSON.stringify(data));
    if (!t.type) {
      throw new Error('need type');
    }
    if (!t.request) {
      throw new Error('need request');
    }
    return this._workerCb(t);
  }
}
