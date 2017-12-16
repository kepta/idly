import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Entity, EntityTable } from 'idly-common/lib/osm/structures';

import { recursiveLookup } from '../../misc/recursiveLookup';
import { entityToFeature } from '../../thread/entityToFeatures';
import {
  WorkerOperation,
  WorkerState,
} from '../operationsTypes';
import { GetFeaturesOfEntityIds } from './type';

/** Worker Thread */
export function workerGetFeaturesOfEntityIds(
  state: WorkerState,
): WorkerOperation<GetFeaturesOfEntityIds> {
  return async ({ entityIds }) => {
    const entities = entityIds
      .map(id => recursiveLookup(id, state.entityTable))
      .reduce((prev: Set<Entity>, curr) => {
        for (const e of curr) {
          prev.add(e);
        }
        return prev;
      }, new Set<Entity>());

    const entityTable: EntityTable = entityTableGen(entities);
    const workerPlugins = await state.plugins;
    const toReturn: GetFeaturesOfEntityIds['response'] = entityToFeature(
      workerPlugins.map((r: any) => r.worker),
    )(entityTable);
    return JSON.stringify(toReturn);
  };
}
