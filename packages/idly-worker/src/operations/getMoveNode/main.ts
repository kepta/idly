import { getChannelBuilder, parseResponse } from '../../misc/channelBuilder';
import { MainOperation, OperationKinds } from '../operationsTypes';
import { GetMoveNode } from './type';

/** Main Thread */
// export function getMoveNode(connector: any): MainOperation<GetMoveNode> {
//   const channel = getChannelBuilder<GetMoveNode>(connector)(
//     OperationKinds.GetMoveNode
//   );
//   return async req => {
//     const json = await channel(req);
//     const fc: GetMoveNode['response'] = JSON.parse(json);
//     return fc;
//   };
// }

export const getMoveNode: (con: any) => MainOperation<GetMoveNode> = (
  connector: any
) => parseResponse(connector, OperationKinds.GetMoveNode);
