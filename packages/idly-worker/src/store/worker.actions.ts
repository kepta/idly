import { actionBuilderFactory, IActionBuilder } from 'idly-common/lib/store';

export enum WorkerActions {
  ADD = 'Worker.Add',
  OTHER = 'Worker.other'
}

export type WorkerActionsTypes = WorkerAddAction | WorkerOtherAction;

export interface WorkerAddAction {
  type: WorkerActions.ADD;
  random: number;
}

export interface WorkerOtherAction {
  type: WorkerActions.OTHER;
}

const actionBuilder = actionBuilderFactory<WorkerActionsTypes>();

export const workerAddAction = actionBuilder<WorkerAddAction>(
  WorkerActions.ADD
);
