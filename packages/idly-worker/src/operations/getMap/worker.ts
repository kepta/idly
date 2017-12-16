import { featureCollection } from '@turf/helpers';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Entity } from 'idly-common/lib/osm/structures';

import { filterXyz } from '../../misc/filterXYZ';
import { tileId } from '../../misc/tileId';
import { entityToFeature } from '../../thread/entityToFeatures';
import {
  WorkerOperation,
  WorkerState,
} from '../operationsTypes';
import { GetMap } from './type';

/** Worker Thread */
export function workerGetMap(state: WorkerState): WorkerOperation<GetMap> {
  return async ({ bbox, zoom, hiddenIds }) => {
    const xyzs = bboxToTiles(bbox, zoom);
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
      features = features.filter(
        r => typeof r.id === 'string' && hiddenIds.indexOf(r.id) === -1,
      );
    }
    const toReturn: GetMap['response'] = featureCollection(features);
    return JSON.stringify(toReturn);
  };
}
