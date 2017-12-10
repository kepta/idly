// import { getChannelBuilder } from '../../misc/channelBuilder';
// import { GetActions, Operation } from '../operationsTypes';
// import { GetFeaturesOfShrub } from './type';

// export function getFeaturesOfShrub(
//   connector: any,
// ): Operation<GetFeaturesOfShrub> {
//   const channel = getChannelBuilder<getGeometry>(connector)(
//     GetActions.getFeaturesOfShrub,
//   );
//   return async request => {
//     const json = await channel(request);
//     const parsedFeatures: GetFeaturesOfShrub['response'] = JSON.parse(json);
//     return parsedFeatures;
//   };
// }
