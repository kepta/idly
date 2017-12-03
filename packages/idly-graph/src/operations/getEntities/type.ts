import { EntityId } from 'idly-common/lib/osm/structures';
import { Shrub } from 'idly-common/lib/state/graph/shrub';

import { GetActions } from '../operationsTypes';

export interface GetEntities {
  readonly type: GetActions.GetEntities;
  readonly request: {
    readonly entityIds: EntityId[];
  };
  readonly response: Shrub;
}
