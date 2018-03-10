import { featureCollection } from '@turf/helpers';
import { Entity } from 'idly-common/lib/osm/structures';
import { entityToGeoJson } from 'idly-osm-to-geojson';
import { nodeMove } from 'idly-state/lib/editing/nodeMove';

import {
  stateAddModified,
  stateGenNextId,
  stateGetEntity,
  stateGetVisibles,
} from 'idly-state/lib/index';

import { WorkerOperation, WorkerState } from '../operationsTypes';
import { GetMoveNode } from './type';

/** Worker Thread */

export function workerGetMoveNode(
  state: WorkerState
): WorkerOperation<GetMoveNode> {
  return async param => {
    console.time('workerGetMoveNode');

    let qState = state.osmState;
    console.log(state.osmState.log);
    if (param.id) {
      qState = stateAddModified(qState, [
        ...nodeMove(qState, param.id, {
          lat: param.loc.lat,
          lon: param.loc.lng,
        }),
      ]);
    }

    self.history[self.history.length - 1].move = qState;

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
