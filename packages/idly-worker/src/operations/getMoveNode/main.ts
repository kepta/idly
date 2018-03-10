import { getChannelBuilder, parseResponse } from '../../misc/channelBuilder';
import { MainOperation, OperationKinds } from '../operationsTypes';
import { GetMoveNode } from './type';

export const getMoveNode: (con: any) => MainOperation<GetMoveNode> = (
  connector: any
) => parseResponse(connector, OperationKinds.GetMoveNode);
