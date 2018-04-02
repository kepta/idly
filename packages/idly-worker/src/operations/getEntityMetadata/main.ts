import { parseResponse } from '../../misc/channelBuilder';
import { MainOperation } from '../helpers';
import { OperationKinds } from '../types';
import { GetEntityMetadata } from './type';

export const getEntityMetadata: (
  con: any
) => MainOperation<GetEntityMetadata> = (connector: any) =>
  parseResponse(connector, OperationKinds.GetEntityMetadata);
