import { Entity, ParentWays } from 'idly-common/lib';
import { mercator } from 'idly-common/lib/geo';

import { WorkerActions, WorkerActionsTypes } from './worker.actions';
const initialState = {};

export function workerReducer(
  state = initialState,
  action: WorkerActionsTypes
) {
  switch (action.type) {
    case WorkerActions.ADD: {
      const { random } = action;
    }
    default:
      return state;
  }
}
