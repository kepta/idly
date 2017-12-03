import { Operation, GetActions } from '../operationsTypes';
import { GetFeaturesOfShrub } from './type';
import { getChannelBuilder } from '../../misc/channelBuilder';

export function getFeaturesOfShrub(
  connector: any,
): Operation<GetFeaturesOfShrub> {
  const channel = getChannelBuilder<GetFeaturesOfShrub>(connector)(
    GetActions.getFeaturesOfShrub,
  );
  return async request => {
    const json = await channel(request);
    const parsedFeatures: GetFeaturesOfShrub['response'] = JSON.parse(json);
    return parsedFeatures;
  };
}
