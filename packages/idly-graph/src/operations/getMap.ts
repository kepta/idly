import { featureCollection } from '@turf/helpers';
import { BBox } from 'idly-common/lib/geo/bbox';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Entity, EntityId } from 'idly-common/lib/osm/structures';

import { getChannelBuilder } from '../misc/channelBuilder';
import { filterXyz } from '../misc/filterXYZ';
import { tileId } from '../misc/tileId';
import { entityToFeature } from '../thread/entityToFeatures';
import {
  GetActions,
  Operation,
  WorkerOperation,
  WorkerState,
} from './operationsTypes';

export interface GetMap {
  readonly type: GetActions.GetMap;
  readonly request: {
    readonly bbox: BBox;
    readonly zoom: number;
    readonly hiddenIds?: EntityId[];
  };
  readonly response: GeoJSON.FeatureCollection<any>;
}

/**
 * this type helps in keeping the parsing worker / main side in
 * sync.
 */

/** Main Thread */
export function getMap(connector: any): Operation<GetMap> {
  const channel = getChannelBuilder<GetMap>(connector)(GetActions.GetMap);
  return async req => {
    const json = await channel(req);
    const fc: GetMap['response'] = JSON.parse(json);
    return fc;
  };
}

/** Worker Thread */

export function workerGetMap(state: WorkerState): WorkerOperation<GetMap> {
  return async ({ bbox, zoom, hiddenIds }) => {
    const xyzs = bboxToTiles(bbox, zoom);
    // tslint:disable-next-line:no-expression-statement
    const prom = filterXyz(xyzs, bbox, zoom >= 18 ? 0.05 : 0.2).map(tile => {
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
    const entities = data.reduce(
      (prev: Entity[], cur) => {
        return prev.concat(cur.entities);
      },
      [] as Entity[],
    );
    let features = entityToFeature(workerPlugins.map((r: any) => r.worker))(
      entityTableGen(entities),
      state.parentWays,
    );
    if (hiddenIds && hiddenIds.length > 0) {
      // tslint:disable-next-line:no-expression-statement
      features = features.filter(
        r => typeof r.id === 'string' && hiddenIds.indexOf(r.id) === -1,
      );
    }
    const toReturn: GetMap['response'] = featureCollection(features);
    return JSON.stringify(toReturn);
  };
}
