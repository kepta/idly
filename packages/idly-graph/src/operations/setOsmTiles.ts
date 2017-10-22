import { BBox } from 'idly-common/lib/geo/bbox';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { EntityTable, ParentWays } from 'idly-common/lib/osm/structures';
import { filterXyz } from '../misc/filterXYZ';

import { setChannelBuilder } from '../misc/channelBuilder';
import { cacheFetchTile } from '../thread/fetchTile';
import { WorkerSetStateActions, WorkerState } from './operationsTypes';

export interface WorkerSetOsmTiles {
  readonly type: WorkerSetStateActions.SetOsmTiles;
  readonly request: {
    readonly bbox: BBox;
    readonly zoom: number;
  };
}

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

/** Worker Thread */

export function workerSetOsmTiles(
  state: WorkerState,
): (request: WorkerSetOsmTiles['request']) => Promise<WorkerState> {
  return async ({ bbox, zoom }) => {
    console.time('fetching');
    const xyzs = filterXyz(
      bboxToTiles(bbox, zoom),
      bbox,
      zoom > 18 ? 0.05 : 0.2,
    );
    const { tilesDataTable, tilesData } = cacheFetchTile(
      state.tilesDataTable,
      xyzs,
    );
    const data = await Promise.all(tilesData);

    console.timeEnd('fetching');
    console.time('Proccessing');

    const { entityTable, parentWays } = data.reduce(
      (
        prev: {
          readonly entityTable: EntityTable;
          readonly parentWays: ParentWays;
        },
        cur,
      ) => {
        return {
          entityTable: prev.entityTable.merge(cur.entityTable),
          parentWays: prev.parentWays.mergeDeep(cur.parentWays),
        };
      },
      {
        entityTable: state.entityTable,
        parentWays: state.parentWays,
      },
    );

    console.timeEnd('Proccessing');

    return {
      ...state,
      entityTable,
      parentWays,
      tilesDataTable,
    };
  };
}
