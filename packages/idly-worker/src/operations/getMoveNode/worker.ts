import { featureCollection } from '@turf/helpers';
import { Entity } from 'idly-common/lib/osm/structures';
import { entityToGeoJson } from 'idly-osm-to-geojson';
import { entryFindRelatedToNode } from 'idly-state/lib/osmState';

import {
  stateAddChanged,
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
      // const newEntity: Entity = {
      //   ...stateGetEntity(qState, param.id),
      //   id: stateGenNextId(qState, param.id),
      //   loc: {
      //     lat: param.loc.lat,
      //     lon: param.loc.lng,
      //   },
      // };

      qState = stateAddChanged(qState, [
        ...entryFindRelatedToNode(qState, param.id, {
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
