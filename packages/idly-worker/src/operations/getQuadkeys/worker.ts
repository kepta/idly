import { featureCollection } from '@turf/helpers';
import { entityToGeoJson } from 'idly-osm-to-geojson';
import { stateGetVisibles, stateShred } from 'idly-state/lib/index';

import { stateAddVirgins } from 'idly-state/lib/index';
import { WorkerOperation, WorkerState } from '../operationsTypes';
import { GetQuadkey } from './type';

/** Worker Thread */
const count = 0;
const MAX_SIZE = 40000;

export function workerGetQuadkey(
  state: WorkerState
): WorkerOperation<GetQuadkey> {
  return async arr => {
    console.time('workerGetQuadkey');

    let qState = state.osmState;
    // if (!self.block) {
    arr.forEach(({ entities, quadkey }) => {
      qState = stateAddVirgins(qState, entities, quadkey);
    });
    // }
    console.log('state nw', qState);
    const vis = stateGetVisibles(qState, arr.map(r => r.quadkey));
    const features = entityToGeoJson(vis);

    self.history[self.history.length - 1].visible = vis;
    if (qState.virgin.elements.size >= MAX_SIZE) {
      console.log(
        'size reached high',
        qState.virgin.elements.size,
        'shredding'
      );
      qState = stateShred(qState);
    }

    console.timeEnd('features');

    return {
      response: featureCollection(features),
      state: {
        ...state,
        osmState: qState,
      },
    };
  };
}
