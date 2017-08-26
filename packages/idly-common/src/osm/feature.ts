import { Point, GeometryObject } from 'geojson';

export interface Feature<
  T extends GeometryObject,
  K extends { [index: string]: boolean | string | number | null | undefined }
> {
  type: 'Feature';
  id?: string;
  geometry: T;
  properties: K;
}
