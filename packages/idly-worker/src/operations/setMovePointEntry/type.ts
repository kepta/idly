import { BBox } from '@turf/helpers';

import { Entity } from 'idly-common/lib/osm/structures';
import { WorkerSetStateActions } from '../operationsTypes';

export interface WorkerSetMovePointEntry {
  readonly type: WorkerSetStateActions.SetMovePointEntry;
  readonly request: {
    readonly entity: Entity;
  };
}
