import { parseResponse } from '../../misc/channelBuilder';
import { MainOperation } from '../helpers';
import { OperationKinds } from '../types';
import { GetMoveNode } from './type';

export const getMoveNode: (con: any) => MainOperation<GetMoveNode> = (
  connector: any
) => parseResponse(connector, OperationKinds.GetMoveNode);
