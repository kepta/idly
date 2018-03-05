import { FeatureCollection } from '@turf/helpers';
import { Entity } from 'idly-common/lib/osm/structures';
import { OperationKinds } from '../operationsTypes';

export interface GetMoveNode {
  readonly type: OperationKinds.GetMoveNode;
  readonly request: {
    readonly id?: string;
    readonly quadkeys: string[];
    readonly loc: {
      lat: number;
      lng: number;
    };
  };
  readonly response: FeatureCollection<any>;
}
