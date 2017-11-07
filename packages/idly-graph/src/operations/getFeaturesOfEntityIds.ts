import { Feature, LineString, Point, Polygon } from '@turf/helpers';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Entity, EntityId, EntityTable } from 'idly-common/lib/osm/structures';

import { getChannelBuilder } from '../misc/channelBuilder';
import { recursiveLookup } from '../misc/recursiveLookup';
import { entityToFeature } from '../thread/entityToFeatures';
import {
  GetActions,
  Operation,
  WorkerOperation,
  WorkerState,
} from './operationsTypes';

export interface GetFeaturesOfEntityIds {
  readonly type: GetActions.GetFeaturesOfEntityIds;
  readonly request: {
    readonly entityIds: EntityId[];
  };
  readonly response: Array<Feature<Point | Polygon | LineString>>;
}

export function getFeaturesOfEntityIds(
  connector: any,
): Operation<GetFeaturesOfEntityIds> {
  const channel = getChannelBuilder<GetFeaturesOfEntityIds>(connector)(
    GetActions.GetFeaturesOfEntityIds,
  );
  return async request => {
    const json = await channel(request);
    const parsedFeatures: GetFeaturesOfEntityIds['response'] = JSON.parse(json);
    return parsedFeatures;
  };
}

/** Worker Thread */

export function workerGetFeaturesOfEntityIds(
  state: WorkerState,
): WorkerOperation<GetFeaturesOfEntityIds> {
  return async ({ entityIds }) => {
    const entities = entityIds
      .map(id => recursiveLookup(id, state.entityTable))
      .reduce((prev: Set<Entity>, curr) => {
        for (const e of curr) {
          // tslint:disable-next-line:no-expression-statement
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
