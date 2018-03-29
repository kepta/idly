import { featureCollection } from '@turf/helpers';
import { entityToGeoJson } from 'idly-osm-to-geojson';
import { stateGetVisibles, stateShred } from 'idly-state/lib/index';
import { stateAddVirgins } from 'idly-state/lib/index';

import { WorkerOperation, WorkerState } from '../helpers';
import { GetQuadkey } from './type';

/** Worker Thread */
const MAX_SIZE = 40000;

export function workerGetQuadkey(
  state: WorkerState
): WorkerOperation<GetQuadkey> {
  return async arr => {
    console.log(arr.map(r => r.quadkey));
    console.time('workerGetQuadkey');

    let qState = state.osmState;
    if (qState.virgin.elements.size >= MAX_SIZE) {
      console.log(
        'size reached high',
        qState.virgin.elements.size,
        'shredding'
      );
      qState = stateShred(qState);
    }

    arr.forEach(({ entities, quadkey }) => {
      qState = stateAddVirgins(qState, entities, quadkey);
    });
    const vis = stateGetVisibles(qState, arr.map(r => r.quadkey));
    const features = entityToGeoJson(vis);

    console.timeEnd('workerGetQuadkey');
    return {
      response: featureCollection(features),
      state: {
        ...state,
        osmState: qState,
      },
    };
  };
}
