import { FeatureCollection } from '@turf/helpers';
import { Entity } from 'idly-common/lib/osm/structures';
import { OperationKinds } from '../types';

export interface GetQuadkey {
  readonly type: OperationKinds.GetQuadkey;
  readonly request: Array<{
    readonly quadkey: string;
    readonly entities: Entity[];
  }>;
  readonly response: FeatureCollection<any>;
}
