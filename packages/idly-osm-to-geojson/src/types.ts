import { Feature, LineString, Point, Polygon } from '@turf/helpers';
import { Entity } from 'idly-common/lib/osm/structures';

export interface Derived<T = Entity> {
  readonly entity: T;
  readonly parentWays: Set<string>;
  readonly parentRelations: Set<string>;
}

export type RelevantGeometry = Feature<Point | Polygon | LineString>;

export type DerivedTable = Map<string, Derived>;
