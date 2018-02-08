import { FeatureCollection } from '@turf/helpers';
import { GetActions } from '../operationsTypes';

export interface GetQuadkey {
  readonly type: GetActions.GetQuadkey;
  readonly request: {
    readonly quadkey: string;
    readonly entitiesStr: string;
  };
  readonly response: FeatureCollection<any>;
}
