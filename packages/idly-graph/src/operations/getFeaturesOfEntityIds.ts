import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Feature } from 'idly-common/lib/osm/feature';
import { EntityId, EntityTable } from 'idly-common/lib/osm/structures';

import { getChannelBuilder } from '../misc/channelBuilder';
import { recursiveLookup } from '../misc/recursiveLookup';
import { entityToFeature } from '../thread/entityToFeatures';
import { WorkerGetStateActions, WorkerState } from './types';

export interface GetFeaturesOfEntityIds {
  readonly type: WorkerGetStateActions.GetFeaturesOfEntityIds;
  readonly request: {
    readonly entityIds: EntityId[];
  };
}

export type ReturnType = Array<Feature<any, any>>;

/** Main Thread */

export function getFeaturesOfEntityIds(
  connector: any,
): (req: GetFeaturesOfEntityIds['request']) => Promise<ReturnType> {
  const channel = getChannelBuilder<GetFeaturesOfEntityIds>(connector)(
    WorkerGetStateActions.GetFeaturesOfEntityIds,
  );
  return async request => {
    const json = await channel(request);
    const parsedFeatures: ReturnType = JSON.parse(json);
    return parsedFeatures;
  };
}

/** Worker Thread */

export function workerGetFeaturesOfEntityIds(
  state: WorkerState,
): (request: GetFeaturesOfEntityIds['request']) => any {
  return async ({ entityIds }) => {
    const entities = entityIds
      .map(id => recursiveLookup(id, state.entityTable))
      .reduce((prev, curr) => prev.concat(curr), [])
      .filter(r => r);
    const entityTable: EntityTable = entityTableGen(entities);
    const workerPlugins = await state.plugins;
    const toReturn: ReturnType = entityToFeature(
      workerPlugins.map((r: any) => r.worker),
    )(entityTable);
    return JSON.stringify(toReturn);
  };
}
