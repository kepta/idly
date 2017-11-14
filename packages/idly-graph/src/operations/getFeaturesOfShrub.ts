import { Feature, LineString, Point, Polygon } from '@turf/helpers';
import { Shrub } from '../graph/Shrub';

import { Tree } from '../graph/Tree';
import { getChannelBuilder } from '../misc/channelBuilder';
import { entityToFeature } from '../thread/entityToFeatures';
import {
  GetActions,
  Operation,
  WorkerOperation,
  WorkerState,
} from './operationsTypes';

export interface GetFeaturesOfShrub {
  readonly type: GetActions.getFeaturesOfShrub;
  readonly request: {
    readonly shrubString: string;
  };
  readonly response: Array<Feature<Point | LineString | Polygon>>;
}

export function getFeaturesOfShrub(
  connector: any,
): Operation<GetFeaturesOfShrub> {
  const channel = getChannelBuilder<GetFeaturesOfShrub>(connector)(
    GetActions.getFeaturesOfShrub,
  );
  return async request => {
    const json = await channel(request);
    const parsedFeatures: GetFeaturesOfShrub['response'] = JSON.parse(json);
    return parsedFeatures;
  };
}

/** Worker Thread */

export function workergetFeaturesOfShrub(
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
