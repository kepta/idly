import { FeatureCollection } from '@turf/helpers';
import { Entity } from 'idly-common/lib/osm/structures';
import { GetActions } from '../operationsTypes';

export interface GetMoveNode {
  readonly type: GetActions.GetMoveNode;
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
