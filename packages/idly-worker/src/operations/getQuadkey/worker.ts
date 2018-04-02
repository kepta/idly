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
    let qState = state.osmState;
    if (qState.virgin.elements.size >= MAX_SIZE) {
      qState = stateShred(qState);
    }

    arr.forEach(({ entities, quadkey }) => {
      qState = stateAddVirgins(qState, entities, quadkey);
    });
    const vis = stateGetVisibles(qState, arr.map(r => r.quadkey));
    const features = entityToGeoJson(vis);

    return {
      response: featureCollection(features),
      state: {
        ...state,
        osmState: qState,
      },
    };
  };
}
