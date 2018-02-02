import { GeometryObject, GeoJsonObject } from 'geojson';

interface Feature<T extends GeometryObject, P extends {}>
  extends GeoJsonObject {
  type: 'Feature';
  geometry: T;
  properties: P;
  id?: string;
}
