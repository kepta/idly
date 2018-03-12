import { featureCollection } from '@turf/helpers';
import { entityToGeoJson } from 'idly-osm-to-geojson';
import { nodeMove } from 'idly-state/lib/editing/nodeMove';
import { stateAddModified, stateGetVisibles } from 'idly-state/lib/index';

import { WorkerOperation, WorkerState } from '../helpers';
import { GetMoveNode } from './type';

/** Worker Thread */

export function workerGetMoveNode(
  state: WorkerState
): WorkerOperation<GetMoveNode> {
  return async param => {
    console.time('workerGetMoveNode');

    let qState = state.osmState;
    if (param.id) {
      qState = stateAddModified(qState, [
        ...nodeMove(qState, param.id, {
          lat: param.loc.lat,
          lon: param.loc.lng,
        }),
      ]);
    }

    const features = entityToGeoJson(stateGetVisibles(qState, param.quadkeys));

    console.timeEnd('workerGetMoveNode');

    return {
      response: featureCollection(features),
      state: {
        ...state,
        osmState: qState,
      },
    };
  };
}
