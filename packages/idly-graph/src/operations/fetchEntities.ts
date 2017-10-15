import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';
import { EntityId } from 'idly-common/lib/osm/structures';

import { Tree } from '../graph/Tree';
import { channelBuilder } from '../misc/channelBuilder';
import { Manager } from '../worker/store/manager';
import { WorkerStateAccessActions } from './types';

export interface WorkerGetEntities {
  readonly type: WorkerStateAccessActions.FetchEntities;
  readonly request: {
    readonly entityIds: EntityId[];
  };
}

export type ReturnType = Tree;

/** Main Thread */

export function fetchEntities(
  connector: any,
): (req: WorkerGetEntities['request']) => Promise<ReturnType> {
  const channel = channelBuilder<WorkerGetEntities>(connector)(
    WorkerStateAccessActions.FetchEntities,
  );
  return async request => {
    const json = await channel(request);
    const parsedTree: ReturnType = Tree.fromString(json);
    return parsedTree;
  };
}

/** Worker Thread */

export function workerFetchEntities(
  manager: Manager,
): (request: WorkerGetEntities['request']) => Promise<string> {
  return async ({ entityIds }) => {
    const entities = await manager.entityLookup(entityIds).map(e => [e.id, e]);
    const toReturn: ReturnType = Tree.fromObject({
      deletedIds: ImSet(),
      entityTable: ImMap(entities),
      knownIds: ImSet(entityIds),
    });
    return JSON.stringify(toReturn.toJs());
  };
}
