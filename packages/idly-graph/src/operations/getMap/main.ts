import { Operation, GetActions } from '../operationsTypes';
import { GetMap } from './type';
import { getChannelBuilder } from '../../misc/channelBuilder';

/** Main Thread */
export function getMap(connector: any): Operation<GetMap> {
  const channel = getChannelBuilder<GetMap>(connector)(GetActions.GetMap);
  return async req => {
    const json = await channel(req);
    const fc: GetMap['response'] = JSON.parse(json);
    return fc;
  };
}
