import { FeatureCollection, featureCollection } from '@turf/helpers';
import { BBox } from 'idly-common/lib/geo/bbox';

import { channelBuilder } from '../misc/channelBuilder';
import { Manager } from '../worker/store/manager';
import { WorkerStateAccessActions } from './types';

export interface WorkerFetchMap {
  readonly type: WorkerStateAccessActions.FetchMap;
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
  const channel = channelBuilder<WorkerFetchMap>(connector)(
    WorkerStateAccessActions.FetchMap,
  );
  return async req => {
    const json = await channel(req);
    const fc: ReturnType = JSON.parse(json);
    return fc;
  };
}

/** Worker Thread */

export function workerFetchMap(
  manager: Manager,
): (request: WorkerFetchMap['request']) => Promise<string> {
  // let entityTable: EntityTable;
  // let parentWays: ParentWays;
  return async ({ bbox, zoom }) => {
    const r = await manager.receive(bbox, zoom);
    const toReturn: ReturnType = featureCollection(r);
    return JSON.stringify(toReturn);

    // console.time('fetching');

    // const xyzs = bboxToTiles(bbox, zoom);
    // const prom = xyzs.map(t => fetchTile(t.x, t.y, parseInt(t.z)));
    // const workerPlugins = await manager.pluginsWorker;
    // const data = await Promise.all(prom);
    // console.timeEnd('fetching');

    // console.log('size=', data.length);
    // console.time('process');
    // console.time('merging');

    // const { entities, entityTable, parentWays } = data.reduce(
    //   (
    //     prev: {
    //       readonly entities: Entity[];
    //       readonly entityTable: EntityTable;
    //       readonly parentWays: ParentWays;
    //     },
    //     cur,
    //   ) => {
    //     return {
    //       entities: prev.entities.concat(cur.entities),
    //       entityTable: prev.entityTable.merge(cur.entityTable),
    //       parentWays: prev.parentWays.mergeDeep(cur.parentWays),
    //     };
    //   },
    //   {
    //     entities: [],
    //     entityTable: ImMap(),
    //     parentWays: ImMap(),
    //   },
    // );
    // console.timeEnd('merging');

    // const p = entityToFeature(workerPlugins.map(r => r.worker))(entityTable);
    // console.timeEnd('process');
    // const toReturn: ReturnType = featureCollection(p);
    // return JSON.stringify(toReturn);
  };
}
