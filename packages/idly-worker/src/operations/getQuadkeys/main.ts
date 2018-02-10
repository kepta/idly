import { getChannelBuilder } from '../../misc/channelBuilder';
import { GetActions, Operation } from '../operationsTypes';
import { GetQuadkey } from './type';

/** Main Thread */
export function getQuadkey(connector: any): Operation<GetQuadkey> {
  const channel = getChannelBuilder<GetQuadkey>(connector)(
    GetActions.GetQuadkey
  );
  return async req => {
    const json = await channel(req);
    const fc: GetQuadkey['response'] = JSON.parse(json);
    return fc;
  };
}
