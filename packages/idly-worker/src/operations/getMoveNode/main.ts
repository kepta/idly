import { getChannelBuilder } from '../../misc/channelBuilder';
import { GetActions, Operation } from '../operationsTypes';
import { GetMoveNode } from './type';

/** Main Thread */
export function getMoveNode(connector: any): Operation<GetMoveNode> {
  const channel = getChannelBuilder<GetMoveNode>(connector)(
    GetActions.GetMoveNode
  );
  return async req => {
    const json = await channel(req);
    const fc: GetMoveNode['response'] = JSON.parse(json);
    return fc;
  };
}
