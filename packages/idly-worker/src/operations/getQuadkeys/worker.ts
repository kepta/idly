import { featureCollection } from '@turf/helpers';
import { entityToGeoJsonNew } from 'idly-common/lib/geojson';
import {
  OsmElement,
  osmStateAddVirgins,
  osmStateCreate,
  OsmTable,
  osmStateGetVisible,
} from 'idly-common/lib/state2/osmState';
import { State } from 'idly-common/lib/state2/state/state';
import { WorkerOperation, WorkerState } from '../operationsTypes';
import { GetQuadkey } from './type';
import { EntityType } from 'idly-common/lib/osm/structures';

/** Worker Thread */
let count = 0;
export function workerGetQuadkey(
  state: WorkerState
): WorkerOperation<GetQuadkey> {
  return async arr => {
    count++;
    console.log('count = ', count);

    const qState: State<OsmElement> = (state as any)._state || osmStateCreate();

    (state as any)._state = qState;
    arr.forEach(({ entities, quadkey }) => {
      osmStateAddVirgins(qState, entities, quadkey);
    });

    const features = entityToGeoJsonNew(
      osmStateGetVisible(qState, arr.map(r => r.quadkey), [])
    );

    const toReturn: GetQuadkey['response'] = featureCollection(features);
    // if (count % 5 === 0) {
    //   (state as any)._state = qState.shred(arr[0].quadkey);
    //   console.log('shredded');
    // }
    return JSON.stringify(toReturn);
  };
}
