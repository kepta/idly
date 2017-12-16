import { Feature, LineString, Point, Polygon } from '@turf/helpers';

import { EntityId } from 'idly-common/lib/osm/structures';

import { GetActions } from '../operationsTypes';

export interface GetFeaturesOfEntityIds {
  readonly type: GetActions.GetFeaturesOfEntityIds;
  readonly request: {
    readonly entityIds: EntityId[];
  };
  readonly response: Array<Feature<Point | Polygon | LineString>>;
}
