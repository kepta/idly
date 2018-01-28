import { Map as ImMap } from 'immutable';

import { Entity } from 'idly-common/lib/osm/structures';
import { Shrub } from 'idly-common/lib/state/graph/shrub';
import { recursiveLookup } from '../../misc/recursiveLookup';
import { WorkerOperation, WorkerState } from '../operationsTypes';
import { GetEntities } from './type';

/** Worker Thread */
export function workerGetEntities(
  state: WorkerState
): WorkerOperation<GetEntities> {
  return async ({ entityIds }) => {
    const entities: Array<[string, Entity]> = entityIds
      .map(id => recursiveLookup(id, state.entityTable))
      .reduce((prev, curr) => prev.concat(curr), [])
      .map(e => [e.id, e] as [string, Entity]);
    if (entities.length === 0) {
      throw new Error('Entity IDs not found');
    }
    const toReturn: GetEntities['response'] = Shrub.create(
      entityIds,
      ImMap(entities)
    );
    // self.presetMatch = entities.map(e => presetMatch(e[1].tags, 'area'));
    return toReturn.toString();
  };
}
