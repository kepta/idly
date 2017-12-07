import { getChannelBuilder } from '../../misc/channelBuilder';
import { GetActions, Operation } from '../operationsTypes';
import { GetMap } from './type';

/** Main Thread */
export function getMap(connector: any): Operation<GetMap> {
  const channel = getChannelBuilder<GetMap>(connector)(GetActions.GetMap);
  return async req => {
    const json = await channel(req);
    const fc: GetMap['response'] = JSON.parse(json);
    return fc;
  };
}
