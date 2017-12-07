import { featureCollection } from '@turf/helpers';
import { BBox } from 'idly-common/lib/geo/bbox';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Entity, EntityId } from 'idly-common/lib/osm/structures';

import { getChannelBuilder } from '../../misc/channelBuilder';
import { filterXyz } from '../../misc/filterXYZ';
import { tileId } from '../../misc/tileId';
import { entityToFeature } from '../../thread/entityToFeatures';
import {
  GetActions,
  Operation,
  WorkerOperation,
  WorkerState,
} from '../operationsTypes';
import { GetBbox } from './type';
import { fetchBboxXml } from '../../thread/fetchBboxXml';
import { smartParser } from '../../thread/smartParser';
import { calculateParentWays } from '../../misc/calculateParentWays';

/** Worker Thread */
export function workerGetBbox(state: WorkerState): WorkerOperation<GetBbox> {
  return async ({ bbox, hiddenIds }) => {
    const entities = smartParser(await fetchBboxXml(bbox));
    const entityTable = entityTableGen(entities);
    const parentWays = calculateParentWays(entityTable);
    const workerPlugins = await state.plugins;
    let features = entityToFeature(workerPlugins.map((r: any) => r.worker))(
      entityTableGen(entities),
      parentWays,
    );
    if (hiddenIds && hiddenIds.length > 0) {
      // tslint:disable-next-line:no-expression-statement
      features = features.filter(
        r => typeof r.id === 'string' && hiddenIds.indexOf(r.id) === -1,
      );
    }
    const toReturn: GetBbox['response'] = featureCollection(features);
    return JSON.stringify(toReturn);
  };
}
