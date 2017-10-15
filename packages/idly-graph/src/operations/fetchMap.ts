import { featureCollection } from '@turf/helpers';
import { BBox } from 'idly-common/lib/geo/bbox';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { ImMap } from 'idly-common/lib/misc/immutable';
import { Entity, EntityTable, ParentWays } from 'idly-common/lib/osm/structures';

import { getChannelBuilder } from '../misc/channelBuilder';
import { tileId } from '../misc/tileId';
import { entityToFeature } from '../thread/entityToFeatures';
import { WorkerGetStateActions, WorkerState } from './types';

export interface WorkerFetchMap {
  readonly type: WorkerGetStateActions.FetchMap;
  readonly request: {
    readonly bbox: BBox;
    readonly zoom: number;
  };
}
/**
 * this type helps in keeping the parsing worker / main side in
 * sync.
 */
export type ReturnType = GeoJSON.FeatureCollection<any>;

/** Main Thread */
/**
 *
 * @param connector
 */
export function fetchMap(
  connector: any,
): (req: WorkerFetchMap['request']) => Promise<ReturnType> {
  const channel = getChannelBuilder<WorkerFetchMap>(connector)(
    WorkerGetStateActions.FetchMap,
  );
  return async req => {
    const json = await channel(req);
    const fc: ReturnType = JSON.parse(json);
    return fc;
  };
}

/** Worker Thread */

export function workerFetchMap(
  state: WorkerState,
): (request: WorkerFetchMap['request']) => Promise<string> {
  // let entityTable: EntityTable;
  // let parentWays: ParentWays;
  return async ({ bbox, zoom }) => {
    // const r = await manager.receive(bbox, zoom);
    // const toReturn: ReturnType = featureCollection(r);
    // return JSON.stringify(toReturn);

    console.time('fetching');

    const xyzs = bboxToTiles(bbox, zoom);
    // const prom = xyzs.map(tile => fetchTile(tile.x, tile.y, tile.z));
    const prom = xyzs.map(tile => {
      const res = state.tilesDataTable.get(tileId(tile));
      if (!res) {
        throw new Error(
          'cannot find tile data, make sure to setOsmTiles before calling fetchMap ',
        );
      }
      return res;
    });

    const workerPlugins = await state.plugins;
    const data = await Promise.all(prom);
    console.timeEnd('fetching');

    console.log('size=', data.length);

    console.time('process');
    console.time('merging');

    const { entityTable, parentWays } = data.reduce(
      (
        prev: {
          readonly entities: Entity[];
          readonly entityTable: EntityTable;
          readonly parentWays: ParentWays;
        },
        cur,
      ) => {
        return {
          entities: prev.entities.concat(cur.entities),
          entityTable: prev.entityTable.merge(cur.entityTable),
          parentWays: prev.parentWays.mergeDeep(cur.parentWays),
        };
      },
      {
        entities: [],
        entityTable: ImMap(),
        parentWays: ImMap(),
      },
    );
    console.timeEnd('merging');

    const p = entityToFeature(workerPlugins.map(r => r.worker))(
      entityTable,
      parentWays,
    );
    const toReturn: ReturnType = featureCollection(p);
    console.timeEnd('process');
    return JSON.stringify(toReturn);
  };
}
