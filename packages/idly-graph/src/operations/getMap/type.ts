import { BBox } from '@turf/helpers';
import { EntityId } from 'idly-common/lib/osm/structures';
import { GetActions } from '../operationsTypes';

export interface GetMap {
  readonly type: GetActions.GetMap;
  readonly request: {
    readonly bbox: BBox;
    readonly zoom: number;
    readonly hiddenIds?: EntityId[];
  };
  readonly response: GeoJSON.FeatureCollection<any>;
}
