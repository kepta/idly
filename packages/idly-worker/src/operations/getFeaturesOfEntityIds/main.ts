import { getChannelBuilder } from '../../misc/channelBuilder';
import { GetActions, Operation } from '../operationsTypes';
import { GetFeaturesOfEntityIds } from './type';

export function getFeaturesOfEntityIds(
  connector: any,
): Operation<GetFeaturesOfEntityIds> {
  const channel = getChannelBuilder<GetFeaturesOfEntityIds>(connector)(
    GetActions.GetFeaturesOfEntityIds,
  );
  return async request => {
    const json = await channel(request);
    const parsedFeatures: GetFeaturesOfEntityIds['response'] = JSON.parse(json);
    return parsedFeatures;
  };
}
