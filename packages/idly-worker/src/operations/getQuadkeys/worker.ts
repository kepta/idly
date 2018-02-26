import { featureCollection } from '@turf/helpers';
import { entityToGeoJson } from 'idly-osm-to-geojson';
import {
  OsmState,
  osmStateAddVirgins,
  osmStateCreate,
  osmStateGetVisible,
  osmStateShred,
} from 'idly-state/lib/osmState';
import { WorkerOperation, WorkerState } from '../operationsTypes';
import { GetQuadkey } from './type';

/** Worker Thread */
let count = 0;
const MAX_SIZE = 50000;
export function workerGetQuadkey(
  state: WorkerState
): WorkerOperation<GetQuadkey> {
  return async arr => {
    count++;
    console.log('count = ', count);

    const qState: OsmState = (state as any)._state || osmStateCreate();

    (state as any)._state = qState;
    self.state = qState;
    // self.log = log;
    // self.osm = osmState;
    arr.forEach(({ entities, quadkey }) => {
      if (!qState[0].hasQuadkey(quadkey)) {
        osmStateAddVirgins(qState, entities, quadkey);
      }
    });
    console.time('features');
    self.visible = osmStateGetVisible(qState, arr.map(r => r.quadkey));

    const features = entityToGeoJson(self.visible);
    console.timeEnd('features');

    const toReturn: GetQuadkey['response'] = featureCollection(features);

    if (qState[0].getElementTable().size >= MAX_SIZE) {
      console.log(
        'size reached high',
        qState[0].getElementTable().size,
        'shredding'
      );
      (state as any)._state = osmStateShred(qState);
    }
    return JSON.stringify(toReturn);
  };
}
