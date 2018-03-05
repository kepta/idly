import { Entity } from 'idly-common/lib/osm/structures';
import { OperationKinds } from '../operationsTypes';

export interface SetMovePointEntry {
  readonly type: OperationKinds.SetMovePointEntry;
  readonly request: {
    readonly entity: Entity;
  };
  readonly response: void;
}
