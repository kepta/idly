import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';
import { EntityId } from 'idly-common/lib/osm/structures';

import { Tree } from '../graph/Tree';
import { getChannelBuilder } from '../misc/channelBuilder';
import { recursiveLookup } from '../misc/recursiveLookup';
import { GetActions, Operation, WorkerOperation, WorkerState } from './operationsTypes';

export interface GetEntities {
  readonly type: GetActions.GetEntities;
  readonly request: {
    readonly entityIds: EntityId[];
  };
  readonly response: Tree;
}

/** Main Thread */
export function getEntities(connector: any): Operation<GetEntities> {
  const channel = getChannelBuilder<GetEntities>(connector)(
    GetActions.GetEntities,
  );
  return async request => {
    const json = await channel(request);
    const parsedTree: GetEntities['response'] = Tree.fromString(json);
    return parsedTree;
  };
}

/** Worker Thread */
export function workerGetEntities(
  state: WorkerState,
): WorkerOperation<GetEntities> {
  return async ({ entityIds }) => {
    const entities = entityIds
      .map(id => recursiveLookup(id, state.entityTable))
      .reduce((prev, curr) => prev.concat(curr), [])
      .map(e => [e.id, e]);
    const toReturn: GetEntities['response'] = Tree.fromObject({
      deletedIds: ImSet(),
      entityTable: ImMap(entities),
      knownIds: ImSet(entityIds),
    });
    return JSON.stringify(toReturn.toJs());
  };
}
