import { Entity } from 'idly-common/lib/osm/structures';
import { OperationKinds } from '../types';

export interface GetDerived {
  readonly type: OperationKinds.GetDerived;
  readonly request: {
    readonly id: string;
  };
  readonly response: {
    derived?: {
      entity: Entity;
      parentWays: string[];
      parentRelations: string[];
    };
  };
}
