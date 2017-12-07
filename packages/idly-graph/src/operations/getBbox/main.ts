import { Operation, GetActions } from '../operationsTypes';
import { GetBbox } from './type';
import { getChannelBuilder } from '../../misc/channelBuilder';

/** Main Thread */
export function getBbox(connector: any): Operation<GetBbox> {
  const channel = getChannelBuilder<GetBbox>(connector)(GetActions.GetBbox);
  return async req => {
    const json = await channel(req);
    const fc: GetBbox['response'] = JSON.parse(json);
    return fc;
  };
}
