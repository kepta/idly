import { parseResponse } from '../../misc/channelBuilder';
import { MainOperation, OperationKinds } from '../operationsTypes';
import { SetMovePointEntry } from './type';

// export function setMovePointEntry(
//   connector: any
// ): MainOperation<SetMovePointEntry> {
//   const setChannel = getChannelBuilder<SetMovePointEntry>(connector)(
//     OperationKinds.SetMovePointEntry
//   );
//   return async request => {
//     await setChannel(request);
//   };
// }

export const setMovePointEntry: (
  con: any
) => MainOperation<SetMovePointEntry> = (connector: any) =>
  parseResponse(connector, OperationKinds.SetMovePointEntry);
