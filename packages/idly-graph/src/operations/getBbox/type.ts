import { EntityId } from 'idly-common/lib/osm/structures';
import { BBox } from '@turf/helpers';
import { GetActions } from '../operationsTypes';

export interface GetBbox {
  readonly type: GetActions.GetBbox;
  readonly request: {
    readonly bbox: BBox;
    readonly hiddenIds?: EntityId[];
  };
  readonly response: GeoJSON.FeatureCollection<any>;
}
