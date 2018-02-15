import { featureCollection } from '@turf/helpers';
import { Entity } from 'idly-common/lib/osm/structures';
import { entityToGeoJsonNew } from 'idly-osm-to-geojson/lib/entityToGeojson';
import {
  entryFindRelatedToNode,
  OsmState,
  osmStateAddModifieds,
  osmStateCreate,
  osmStateGetEntity,
  osmStateGetNextId,
  osmStateGetVisible,
  osmStateShred,
} from 'idly-state/lib/osmState';

import { WorkerOperation, WorkerState } from '../operationsTypes';
import { GetMoveNode } from './type';

/** Worker Thread */

export function workerGetMoveNode(
  state: WorkerState
): WorkerOperation<GetMoveNode> {
  return async param => {
    let qState: OsmState = (state as any)._state || osmStateCreate();
    if (param.id) {
      const newEntity: Entity = {
        ...osmStateGetEntity(qState, param.id),
        id: osmStateGetNextId(qState, param.id),
        loc: {
          lat: param.loc.lat,
          lon: param.loc.lng,
        },
      };

      qState = osmStateAddModifieds(qState, [
        ...entryFindRelatedToNode(qState, newEntity.id, param.id),
        newEntity,
      ]);
    }

    (state as any)._state = qState;

    self.state = qState;
    // self.log = log;
    // self.osm = osmState;
    console.time('features');
    self.visible = osmStateGetVisible(qState, param.quadkeys);
    const features = entityToGeoJsonNew(self.visible);

    console.timeEnd('features');

    const toReturn: GetMoveNode['response'] = featureCollection(features);

    if (qState[0].getElementTable().size >= 12000) {
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
