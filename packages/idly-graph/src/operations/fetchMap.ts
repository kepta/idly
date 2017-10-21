import * as area from '@turf/area';
import * as bboxPolygon from '@turf/bbox-polygon';
import * as intersects from '@turf/intersect';
import { filterXyz } from '../misc/filterXYZ';

import { featureCollection } from '@turf/helpers';
import { mercator } from 'idly-common/lib/geo/sphericalMercator';
import { Tile } from 'idly-common/lib/geo/tile';

import { BBox } from 'idly-common/lib/geo/bbox';

import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { ImMap } from 'idly-common/lib/misc/immutable';
import {
  Entity,
  EntityId,
  EntityTable,
  ParentWays,
} from 'idly-common/lib/osm/structures';

import { getChannelBuilder } from '../misc/channelBuilder';
import { tileId } from '../misc/tileId';
import { entityToFeature } from '../thread/entityToFeatures';
import { WorkerGetStateActions, WorkerState } from './types';

export interface WorkerFetchMap {
  readonly type: WorkerGetStateActions.FetchMap;
  readonly request: {
    readonly bbox: BBox;
    readonly zoom: number;
    readonly hiddenIds?: EntityId[];
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
  return async ({ bbox, zoom, hiddenIds }) => {
    // const r = await manager.receive(bbox, zoom);
    // const toReturn: ReturnType = featureCollection(r);
    // return JSON.stringify(toReturn);
    console.time('fetching');
    const xyzs = bboxToTiles(bbox, zoom);
    console.log(state.tilesDataTable);
    const prom = filterXyz(xyzs, bbox, zoom > 18 ? 0.05 : 0.2).map(tile => {
      const res = state.tilesDataTable.get(tileId(tile));
      if (!res) {
        throw new Error(
          `cannot find tile data for ${JSON.stringify(
            tile,
          )}, make sure to setOsmTiles before calling fetchMap `,
        );
      }
      return res;
    });

    const workerPlugins = await state.plugins;
    const data = await Promise.all(prom);
    console.timeEnd('fetching');

    console.log('size = ', data.length);

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

    let features = entityToFeature(workerPlugins.map((r: any) => r.worker))(
      entityTable,
      parentWays,
    );
    if (hiddenIds && hiddenIds.length > 0) {
      // tslint:disable-next-line:no-expression-statement
      features = features.filter(r => r.id && hiddenIds.indexOf(r.id) === -1);
    }
    const toReturn: ReturnType = featureCollection(features);
    console.timeEnd('process');
    return JSON.stringify(toReturn);
  };
}
