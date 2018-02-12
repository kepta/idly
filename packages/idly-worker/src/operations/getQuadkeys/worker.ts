import { featureCollection } from '@turf/helpers';
import { entityToGeoJsonNew } from 'idly-common/lib/geojson';
import { EntityType } from 'idly-common/lib/osm/structures';
import {
  OsmElement,
  osmStateAddVirgins,
  osmStateCreate,
  osmStateGetVisible,
  osmStateShred,
} from 'idly-common/lib/state2/osmState';
import * as osmState from 'idly-common/lib/state2/osmState';
import * as log from 'idly-common/lib/state2/log';
import { State } from 'idly-common/lib/state2/state/state';
import { WorkerOperation, WorkerState } from '../operationsTypes';
import { GetQuadkey } from './type';

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
    self.state = qState;
    self.log = log;
    self.osm = osmState;
    arr.forEach(({ entities, quadkey }) => {
      osmStateAddVirgins(qState, entities, quadkey);
    });
    console.time('features');
    self.visible = osmStateGetVisible(
      qState,
      arr.map(r => r.quadkey),
      self.l || []
    );
    const features = entityToGeoJsonNew(self.visible);
    console.timeEnd('features');
    console.log('rendering', self.l || []);
    console.time('featuresC');
    const toReturn: GetQuadkey['response'] = featureCollection(features);

    console.timeEnd('featuresC');

    if (count % 5 === 0) {
      (state as any)._state = osmStateShred(qState, self.l || []);
    }
    return JSON.stringify(toReturn);
  };
}
