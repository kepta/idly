import { Entity } from 'idly-common/lib/osm/structures';
import { OperationKinds } from '../types';

export interface GetEntityMetadata {
  readonly type: OperationKinds.GetEntityMetadata;
  readonly request: {
    readonly id: string;
  };
  readonly response: {
    entity?: Entity;
    parentWays: string[];
    parentRelations: string[];
    preset?: {
      name: string;
    };
  };
}
