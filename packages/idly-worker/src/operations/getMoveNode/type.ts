import { FeatureCollection } from '@turf/helpers';
import { OperationKinds } from '../types';

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
