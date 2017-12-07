import { Shrub } from 'idly-common/lib/state/graph/shrub';

import { entityToFeature } from '../../thread/entityToFeatures';
import {
  WorkerOperation,
  WorkerState,
} from '../operationsTypes';
import { GetFeaturesOfShrub } from './type';

/** Worker Thread */
export function workerGetFeaturesOfShrub(
  state: WorkerState,
): WorkerOperation<GetFeaturesOfShrub> {
  return async ({ shrubString }) => {
    const shrub = Shrub.fromString(shrubString);
    const { entityTable, knownIds } = shrub.toObject();
    // TODO figure out deleted entities, for now I will subtract them
    //  from entityTable :?
    let filteredEntityTable = entityTable;
    knownIds.forEach(id => {
      filteredEntityTable = filteredEntityTable.delete(id);
    });

    const workerPlugins = await state.plugins;
    const toReturn: GetFeaturesOfShrub['response'] = entityToFeature(
      workerPlugins.map((r: any) => r.worker),
    )(filteredEntityTable);
    return JSON.stringify(toReturn);
  };
}
