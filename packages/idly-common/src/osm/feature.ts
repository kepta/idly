import { GeometryObject } from 'geojson';
import { Map as ImMap } from 'immutable';

import { EntityId } from '../osm/structures';

export interface Feature<
  T extends GeometryObject,
  K extends { [index: string]: boolean | string | number | null | undefined }
> {
  type: 'Feature';
  id?: string;
  geometry: T;
  properties: K;
}

export type FeatureTable<
  T extends GeometryObject,
  K extends { [index: string]: boolean | string | number | null | undefined }
> = ImMap<EntityId, Feature<T, K> | undefined>;
