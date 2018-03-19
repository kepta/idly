import { Entity } from 'idly-common/lib/osm/structures';
import { OperationKinds } from '../types';

export interface GetEntity {
  readonly type: OperationKinds.GetEntity;
  readonly request: {
    readonly id: string;
  };
  readonly response?: Entity;
}
