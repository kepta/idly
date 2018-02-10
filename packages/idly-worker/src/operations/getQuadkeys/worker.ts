import { Entity } from 'idly-common/lib/osm/structures';

import { featureCollection } from '@turf/helpers';
import { entityToGeoJsonNew } from 'idly-common/lib/geojson';
import {
  OsmElement,
  osmStateAddVirgins,
  osmStateCreate,
  OsmTable,
} from 'idly-common/lib/state2/osmTable/osmTable';
import { State } from 'idly-common/lib/state2/state/state';
import { WorkerOperation, WorkerState } from '../operationsTypes';
import { GetQuadkey } from './type';

/** Worker Thread */
export function workerGetQuadkey(
  state: WorkerState
): WorkerOperation<GetQuadkey> {
  return async arr => {
    // const entities: Entity[] = JSON.parse(entitiesStr);
    const qState: State<OsmElement> = (state as any)._state || osmStateCreate();

    arr.forEach(({ entities, quadkey }) => {
      osmStateAddVirgins(qState, entities, quadkey);
    });

    const visibleIds = qState.getVisible(arr.map(r => r.quadkey), []);

    const eTable = qState.getElementTable();

    const result: OsmTable = new Map();

    visibleIds.forEach(id => result.set(id, eTable.get(id) as OsmElement));

    const features = entityToGeoJsonNew(result);

    const toReturn: GetQuadkey['response'] = featureCollection(features);

    return JSON.stringify(toReturn);
  };
}
