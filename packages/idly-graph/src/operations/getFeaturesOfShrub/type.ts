import { Feature, LineString, Point, Polygon } from '@turf/helpers';

import { GetActions } from '../operationsTypes';

export interface GetFeaturesOfShrub {
  readonly type: GetActions.getFeaturesOfShrub;
  readonly request: {
    readonly shrubString: string;
  };
  readonly response: Array<Feature<Point | LineString | Polygon>>;
}
