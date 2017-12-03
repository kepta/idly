import { Operation, GetActions } from '../operationsTypes';
import { GetFeaturesOfEntityIds } from './type';
import { getChannelBuilder } from '../../misc/channelBuilder';

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
