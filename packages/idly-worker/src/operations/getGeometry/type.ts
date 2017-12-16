import { Shrub } from 'idly-common/lib/state/graph/shrub';

import { Feature, LineString, Point, Polygon } from '@turf/helpers';

import { GetActions } from '../operationsTypes';

export interface GetFeaturesOfShrub {
  readonly type: GetActions.getFeaturesOfShrub;
  readonly request: {
    readonly shrub: Shrub;
  };
  readonly response: Array<Feature<Point | LineString | Polygon>>;
}
