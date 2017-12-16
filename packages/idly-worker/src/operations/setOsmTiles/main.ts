
import { setChannelBuilder } from '../../misc/channelBuilder';
import { WorkerSetStateActions } from '../operationsTypes';
import { WorkerSetOsmTiles } from './type';

/** Main Thread */
/**
 *
 * @param connector
 */
export function setOsmTiles(
  connector: any,
): (req: WorkerSetOsmTiles['request']) => Promise<string> {
  const setChannel = setChannelBuilder<WorkerSetOsmTiles>(connector)(
    WorkerSetStateActions.SetOsmTiles,
  );
  return request => setChannel(request);
}
