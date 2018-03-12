import { parseResponse } from '../../misc/channelBuilder';
import { MainOperation } from '../helpers';
import { OperationKinds } from '../types';
import { GetQuadkey } from './type';

export const getQuadkey: (con: any) => MainOperation<GetQuadkey> = (
  connector: any
) => parseResponse(connector, OperationKinds.GetQuadkey);
