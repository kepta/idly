import { List, Map, Record } from 'immutable';
import { ITags, tagsFactory } from 'osm/entities/helpers/tags';

import { Geometries } from 'osm/entities/constants';
import { Properties, propertiesGen } from 'osm/entities/helpers/properties';

type Id = string;
type Version = number;
type Visible = boolean;

export class Relation extends Record({
  id: 'w-0',
  properties: propertiesGen(),
  tags: tagsFactory(),
  type: 'relation',
  members: List(),
  geometry: Geometries.RELATION
}) {
  readonly id: Id;
  readonly type: string;
  readonly tags: ITags;
  readonly properties: Properties;
  readonly members: List<Map<string, any>>;
  readonly geometry: Geometries.RELATION | Geometries.AREA;
  public set(k: string, v: any): Relation {
    return super.set(k, v) as Relation;
  }
}

export function relationFactory(obj: {
  id: Id;
  tags?: ITags;
  properties?: Properties;
  members?: List<string>;
  geometry?: Geometries.RELATION | Geometries.AREA;
}) {
  return new Relation(obj);
}
