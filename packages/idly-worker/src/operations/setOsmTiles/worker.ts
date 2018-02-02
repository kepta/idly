import { bboxToTiles } from 'idly-common/lib/geo';
import {
  EntityTable,
  ParentWays,
} from 'idly-common/lib/osm/immutableStructures';

import { filterXyz } from '../../misc/filterXYZ';
import { cacheFetchTile } from '../../thread/fetchTile';
import { WorkerState } from '../operationsTypes';
import { WorkerSetOsmTiles } from './type';

/** Worker Thread */

export function workerSetOsmTiles(
  state: WorkerState
): (request: WorkerSetOsmTiles['request']) => Promise<WorkerState> {
  return async ({ bbox, zoom }) => {
    const xyzs = filterXyz(
      bboxToTiles(bbox, zoom),
      bbox,
      zoom >= 18 ? 0.05 : 0.2
    );
    const { tilesDataTable, tilesData } = cacheFetchTile(
      state.tilesDataTable,
      xyzs
    );
    const data = await Promise.all(tilesData);

    const { entityTable, parentWays } = data.reduce(
      (
        prev: {
          readonly entityTable: EntityTable;
          readonly parentWays: ParentWays;
        },
        cur
      ) => {
        return {
          entityTable: prev.entityTable.merge(cur.entityTable),
          parentWays: prev.parentWays.mergeDeep(cur.parentWays),
        };
      },
      {
        entityTable: state.entityTable,
        parentWays: state.parentWays,
      }
    );

    return {
      ...state,
      entityTable,
      parentWays,
      tilesDataTable,
    };
  };
}
