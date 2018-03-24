import { parseResponse } from '../../misc/channelBuilder';
import { MainOperation } from '../helpers';
import { OperationKinds } from '../types';
import { GetDerived } from './type';

export const getDerived: (con: any) => MainOperation<GetDerived> = (
  connector: any
) => parseResponse(connector, OperationKinds.GetDerived);
