import { BBox } from 'idly-common/lib/geo/bbox';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { EntityTable, ParentWays } from 'idly-common/lib/osm/structures';

import { setChannelBuilder } from '../../misc/channelBuilder';
import { filterXyz } from '../../misc/filterXYZ';
import { cacheFetchTile } from '../../thread/fetchTile';
import { WorkerSetStateActions, WorkerState } from '../operationsTypes';
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
