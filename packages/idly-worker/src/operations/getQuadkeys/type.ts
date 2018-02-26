import { FeatureCollection } from '@turf/helpers';
import { Entity } from 'idly-common/lib/osm/structures';
import { GetActions } from '../operationsTypes';

export interface GetQuadkey {
  readonly type: GetActions.GetQuadkey;
  readonly request: Array<{
    readonly quadkey: string;
    readonly entities: Entity[];
  }>;
  readonly response: FeatureCollection<any>;
}
