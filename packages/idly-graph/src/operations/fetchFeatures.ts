import { Feature } from 'idly-common/lib/osm/feature';
import { EntityId } from 'idly-common/lib/osm/structures';

import { channelBuilder } from '../misc/channelBuilder';
import { Manager } from '../worker/store/manager';
import { WorkerActions } from './types';

export interface WorkerFetchFeatures {
  readonly type: WorkerActions.FetchFeatures;
  readonly request: {
    readonly entityIds: EntityId[];
  };
}

export type ReturnType = Array<Feature<any, any>>;

/** Main Thread */

export function fetchFeatures(
  connector: any,
): (req: WorkerFetchFeatures['request']) => Promise<ReturnType> {
  const channel = channelBuilder<WorkerFetchFeatures>(connector)(
    WorkerActions.FetchFeatures,
  );
  return async request => {
    const json = await channel(request);
    const parsedFeatures: ReturnType = JSON.parse(json);
    return parsedFeatures;
  };
}

/** Worker Thread */

export function workerFetchFeatures(
  manager: Manager,
): (request: WorkerFetchFeatures['request']) => Promise<string> {
  return async ({ entityIds }) => {
    const toReturn: ReturnType = await manager.featureLookup(entityIds);
    console.log(entityIds, toReturn);
    return JSON.stringify(toReturn);
  };
}
