import { GetActions } from '../operationsTypes';
import { BBox } from '@turf/helpers';
import { EntityId } from 'idly-common/lib/osm/structures';

export interface GetMap {
  readonly type: GetActions.GetMap;
  readonly request: {
    readonly bbox: BBox;
    readonly zoom: number;
    readonly hiddenIds?: EntityId[];
  };
  readonly response: GeoJSON.FeatureCollection<any>;
}
