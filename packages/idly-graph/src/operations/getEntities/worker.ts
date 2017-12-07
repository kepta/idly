import { Map as ImMap } from 'immutable';

import { Shrub } from 'idly-common/lib/state/graph/shrub';

import { recursiveLookup } from '../../misc/recursiveLookup';
import {
  WorkerOperation,
  WorkerState,
} from '../operationsTypes';
import { GetEntities } from './type';

/** Worker Thread */
export function workerGetEntities(
  state: WorkerState,
): WorkerOperation<GetEntities> {
  return async ({ entityIds }) => {
    const entities = entityIds
      .map(id => recursiveLookup(id, state.entityTable))
      .reduce((prev, curr) => prev.concat(curr), [])
      .map(e => [e.id, e]);
    const toReturn: GetEntities['response'] = Shrub.create(
      entityIds,
      ImMap(entities),
    );
    return toReturn.toString();
  };
}
