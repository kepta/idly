import { Entity } from 'idly-common/lib/osm/structures';

export interface Derived {
  readonly entity: Entity;
  readonly parentWays: Set<string>;
  readonly parentRelations: Set<string>;
}
