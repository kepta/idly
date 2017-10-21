import { BBox } from 'idly-common/lib/geo/bbox';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import {
  EntityId,
  EntityTable,
  ParentWays,
} from 'idly-common/lib/osm/structures';
import { filterXyz } from '../misc/filterXYZ';

import { setChannelBuilder } from '../misc/channelBuilder';
import { cacheFetchTile } from '../thread/fetchTile';
import { WorkerSetStateActions, WorkerState } from './types';

export interface WorkerSetHideEntities {
  readonly type: WorkerSetStateActions.SetHideEntities;
  readonly request: {
    readonly entityIds: EntityId[];
  };
}

/** Main Thread */
/**
 * @param connector
 */
export function setHideEntities(
  connector: any,
): (req: WorkerSetHideEntities['request']) => Promise<string> {
  const setChannel = setChannelBuilder<WorkerSetHideEntities>(connector)(
    WorkerSetStateActions.SetHideEntities,
  );
  return request => setChannel(request);
}

/** Worker Thread */

export function workerSetHideEntities(
  state: WorkerState,
): (request: WorkerSetHideEntities['request']) => Promise<WorkerState> {
  return async ({ entityIds }) => {
    return {
      ...state,
      hiddenEntities: entityIds,
    };
  };
}
