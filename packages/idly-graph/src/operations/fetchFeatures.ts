import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Feature } from 'idly-common/lib/osm/feature';
import { EntityId, EntityTable } from 'idly-common/lib/osm/structures';

import { getChannelBuilder } from '../misc/channelBuilder';
import { entityToFeature } from '../thread/entityToFeatures';
import { recursiveLookup } from '../misc/recursiveLookup';
import { WorkerGetStateActions, WorkerState } from './types';

export interface WorkerGetFeatures {
  readonly type: WorkerGetStateActions.GetFeatures;
  readonly request: {
    readonly entityIds: EntityId[];
  };
}

export type ReturnType = Array<Feature<any, any>>;

/** Main Thread */

export function fetchFeatures(
  connector: any,
): (req: WorkerGetFeatures['request']) => Promise<ReturnType> {
  const channel = getChannelBuilder<WorkerGetFeatures>(connector)(
    WorkerGetStateActions.GetFeatures,
  );
  return async request => {
    const json = await channel(request);
    const parsedFeatures: ReturnType = JSON.parse(json);
    return parsedFeatures;
  };
}

/** Worker Thread */

export function workerFetchFeatures(
  state: WorkerState,
): (request: WorkerGetFeatures['request']) => any {
  return async ({ entityIds }) => {
    const result = [];
    const entities = entityIds
      .map(id => recursiveLookup(id, state.entityTable))
      .reduce((prev, curr) => prev.concat(curr), []);
    const entityTable: EntityTable = entityTableGen(entities);
    const workerPlugins = await state.plugins;
    const toReturn: ReturnType = entityToFeature(
      workerPlugins.map(r => r.worker),
    )(entityTable);
    return JSON.stringify(toReturn);
  };
}
