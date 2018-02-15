import {
  entryFindRelatedToNode,
  OsmState,
  osmStateAddModifieds,
  osmStateGetEntity,
  osmStateGetNextId,
} from 'idly-state/lib/osmState';
import { WorkerState } from '../operationsTypes';
import { WorkerSetMovePointEntry } from './type';

/** Worker Thread */

export function workerSetMovePointEntry(
  state: WorkerState
): (request: WorkerSetMovePointEntry['request']) => Promise<WorkerState> {
  return async ({ entity }) => {
    console.log(entity);
    const osmState: OsmState = state._state;
    const newEntity = {
      ...osmStateGetEntity(osmState, entity[0]),
      loc: {
        lat: entity[1].lat,
        lon: entity[1].lng,
      },
      id: osmStateGetNextId(osmState, entity[0]),
    };

    state._state = osmStateAddModifieds(osmState, [
      ...entryFindRelatedToNode(osmState, newEntity.id, entity[0]),
      newEntity,
    ]);
    return {
      ...state,
    };
  };
}
