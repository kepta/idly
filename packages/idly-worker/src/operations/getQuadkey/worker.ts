import { Entity } from 'idly-common/lib/osm/structures';
import {
  Element,
  ElementTable,
} from 'idly-common/lib/state2/osmTables/elementTable';
import { State } from 'idly-common/lib/state2/osmTables/state';

import { featureCollection } from '@turf/helpers';
import { entityToFeatureNew } from '../../thread/entityToFeatures';
import { WorkerOperation, WorkerState } from '../operationsTypes';
import { GetQuadkey } from './type';

/** Worker Thread */
export function workerGetQuadkey(
  state: WorkerState
): WorkerOperation<GetQuadkey> {
  return async ({ quadkey, entitiesStr }) => {
    const entities: Entity[] = JSON.parse(entitiesStr);

    const qState: State = (state as any)._state || State.create();
    (state as any)._state = qState;

    qState.addVirgin(entities, quadkey);
    const visible = qState.getVisible([quadkey]);
    const eTable = qState.getElementTable();
    const result: ElementTable = new Map();

    visible.forEach(id => result.set(id, eTable.get(id) as Element));

    const features = entityToFeatureNew(result);

    const toReturn: GetQuadkey['response'] = featureCollection(features);

    return JSON.stringify(toReturn);
  };
}
