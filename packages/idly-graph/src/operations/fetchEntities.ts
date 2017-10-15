import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';
import { EntityId } from 'idly-common/lib/osm/structures';

import { Tree } from '../graph/Tree';
import { getChannelBuilder } from '../misc/channelBuilder';
import { recursiveLookup } from '../worker/util/recursiveLookup';
import { WorkerGetStateActions, WorkerState } from './types';

export interface WorkerGetEntities {
  readonly type: WorkerGetStateActions.GetEntities;
  readonly request: {
    readonly entityIds: EntityId[];
  };
}

export type ReturnType = Tree;

/** Main Thread */

export function fetchEntities(
  connector: any,
): (req: WorkerGetEntities['request']) => Promise<ReturnType> {
  const channel = getChannelBuilder<WorkerGetEntities>(connector)(
    WorkerGetStateActions.GetEntities,
  );
  return async request => {
    const json = await channel(request);
    const parsedTree: ReturnType = Tree.fromString(json);
    return parsedTree;
  };
}

/** Worker Thread */

export function workerFetchEntities(
  state: WorkerState,
): (request: WorkerGetEntities['request']) => Promise<string> {
  return async ({ entityIds }) => {
    const entities = entityIds
      .map(id => recursiveLookup(id, state.entityTable))
      .reduce((prev, curr) => prev.concat(curr), [])
      .map(e => [e.id, e]);
    const toReturn: ReturnType = Tree.fromObject({
      deletedIds: ImSet(),
      entityTable: ImMap(entities),
      knownIds: ImSet(entityIds),
    });
    return JSON.stringify(toReturn.toJs());
  };
}
