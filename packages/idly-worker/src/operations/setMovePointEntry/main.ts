import { setChannelBuilder } from '../../misc/channelBuilder';
import { WorkerSetStateActions } from '../operationsTypes';
import { WorkerSetMovePointEntry } from './type';

/** Main Thread */
/**
 *
 * @param connector
 */
export function setMovePointEntry(
  connector: any
): (req: WorkerSetMovePointEntry['request']) => Promise<string> {
  const setChannel = setChannelBuilder<WorkerSetMovePointEntry>(connector)(
    WorkerSetStateActions.SetMovePointEntry
  );
  return request => setChannel(request);
}
