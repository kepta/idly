import {
  stateGenNextId,
  stateGetEntity,
  stateAddChanged,
} from 'idly-state/lib/index';
import { entryFindRelatedToNode } from 'idly-state/lib/osmState';
import { WorkerOperation, WorkerState } from '../operationsTypes';
import { SetMovePointEntry } from './type';

/** Worker Thread */

export function workerSetMovePointEntry(
  state: WorkerState
): WorkerOperation<SetMovePointEntry> {
  return async ({ entity }) => {
    let osmState = state.osmState;
    const newEntity = {
      ...stateGetEntity(osmState, entity[0]),
      loc: {
        lat: entity[1].lat,
        lon: entity[1].lng,
      },
      id: stateGenNextId(osmState, entity[0]),
    };

    osmState = stateAddChanged(osmState, [
      ...entryFindRelatedToNode(osmState, newEntity.id, entity[0]),
      newEntity,
    ]);

    return {
      response: undefined,
      state: {
        ...state,
        osmState,
      },
    };
  };
}
