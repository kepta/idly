import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Feature } from 'idly-common/lib/osm/feature';
import { EntityId, EntityTable } from 'idly-common/lib/osm/structures';

import { Tree } from '../graph/Tree';
import { getChannelBuilder } from '../misc/channelBuilder';
import { recursiveLookup } from '../misc/recursiveLookup';
import { entityToFeature } from '../thread/entityToFeatures';
import {
  GetActions,
  Operation,
  WorkerOperation,
  WorkerState,
} from './operationsTypes';

export interface GetFeaturesOfTree {
  readonly type: GetActions.GetFeaturesOfTree;
  readonly request: {
    readonly treeString: string;
  };
  readonly response: Array<Feature<any, any>>;
}

export function getFeaturesOfTree(
  connector: any,
): Operation<GetFeaturesOfTree> {
  const channel = getChannelBuilder<GetFeaturesOfTree>(connector)(
    GetActions.GetFeaturesOfTree,
  );
  return async request => {
    const json = await channel(request);
    const parsedFeatures: GetFeaturesOfTree['response'] = JSON.parse(json);
    return parsedFeatures;
  };
}

/** Worker Thread */

export function workerGetFeaturesOfTree(
  state: WorkerState,
): WorkerOperation<GetFeaturesOfTree> {
  return async ({ treeString }) => {
    const tree = Tree.fromString(treeString);
    const { entityTable, deletedIds } = tree.toObject();
    // TODO figure out deleted entities, for now I will subtract them
    //  from entityTable :?
    const filteredTable = entityTable
      .filter((v, k = '') => {
        return !deletedIds.has(k);
      })
      .toMap();
    const workerPlugins = await state.plugins;
    const toReturn: GetFeaturesOfTree['response'] = entityToFeature(
      workerPlugins.map((r: any) => r.worker),
    )(filteredTable);
    return JSON.stringify(toReturn);
  };
}
