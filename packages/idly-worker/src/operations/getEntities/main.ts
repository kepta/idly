import { Shrub } from 'idly-common/lib/state/graph/shrub';

import { getChannelBuilder } from '../../misc/channelBuilder';
import { GetActions, Operation } from '../operationsTypes';
import { GetEntities } from './type';

export function getEntities(connector: any): Operation<GetEntities> {
  const channel = getChannelBuilder<GetEntities>(connector)(
    GetActions.GetEntities,
  );
  return async request => {
    const json = await channel(request);
    const parsedTree: GetEntities['response'] = Shrub.fromString(json);
    return parsedTree;
  };
}
