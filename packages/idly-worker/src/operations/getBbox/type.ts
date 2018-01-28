import { BBox, FeatureCollection } from '@turf/helpers';
import { EntityId } from 'idly-common/lib/osm/structures';
import { GetActions } from '../operationsTypes';

export interface GetBbox {
  readonly type: GetActions.GetBbox;
  readonly request: {
    readonly bbox: BBox;
    readonly hiddenIds?: EntityId[];
  };
  readonly response: FeatureCollection<any>;
}
