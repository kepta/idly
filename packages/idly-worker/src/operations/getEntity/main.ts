
import { parseResponse } from '../../misc/channelBuilder';
import { MainOperation } from '../helpers';
import { OperationKinds } from '../types';
import { GetEntity } from './type';

export const getEntity: (con: any) => MainOperation< GetEntity> = (
    connector: any
) => parseResponse(connector, OperationKinds.GetEntity);
