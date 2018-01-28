import { featureCollection } from '@turf/helpers';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { smartParser } from 'idly-faster-osm-parser';

import { calculateParentWays } from '../../misc/calculateParentWays';
import { entityToFeature } from '../../thread/entityToFeatures';
import { fetchBboxXml } from '../../thread/fetchBboxXml';
import { WorkerOperation, WorkerState } from '../operationsTypes';
import { GetBbox } from './type';

/** Worker Thread */
export function workerGetBbox(state: WorkerState): WorkerOperation<GetBbox> {
  return async ({ bbox, hiddenIds }) => {
    const entities = smartParser(await fetchBboxXml(bbox));
    const entityTable = entityTableGen(entities);
    const parentWays = calculateParentWays(entityTable);
    const workerPlugins = await state.plugins;
    let features = entityToFeature(workerPlugins.map((r: any) => r.worker))(
      entityTableGen(entities),
      parentWays
    );
    if (hiddenIds && hiddenIds.length > 0) {
      features = features.filter(
        r => typeof r.id === 'string' && hiddenIds.indexOf(r.id) === -1
      );
    }
    const toReturn: GetBbox['response'] = featureCollection(features);
    return JSON.stringify(toReturn);
  };
}
