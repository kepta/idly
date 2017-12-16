import { BBox } from '@turf/helpers';

import { WorkerSetStateActions } from '../operationsTypes';

export interface WorkerSetOsmTiles {
  readonly type: WorkerSetStateActions.SetOsmTiles;
  readonly request: {
    readonly bbox: BBox;
    readonly zoom: number;
  };
}
