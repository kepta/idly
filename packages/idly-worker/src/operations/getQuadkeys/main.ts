import { parseResponse } from '../../misc/channelBuilder';
import { MainOperation, OperationKinds } from '../operationsTypes';
import { GetQuadkey } from './type';

/** Main Thread */
// export function getQuadkey(connector: any): MainOperation<GetQuadkey> {
//   const channel = getChannelBuilder<GetQuadkey>(connector)(
//     OperationKinds.GetQuadkey
//   );
//   return async req => {
//     const json = await channel(req);
//     const fc: GetQuadkey['response'] = JSON.parse(json);
//     return fc;
//   };
// }

export const getQuadkey: (con: any) => MainOperation<GetQuadkey> = (
  connector: any
) => parseResponse(connector, OperationKinds.GetQuadkey);
