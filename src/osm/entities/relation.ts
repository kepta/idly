import { List, Map, Record } from 'immutable';
import { Tags, tagsFactory } from 'osm/entities/helpers/tags';

import { Geometry } from 'osm/entities/constants';
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
  geometry: Geometry.RELATION
}) {
  readonly id: Id;
  readonly type: string;
  readonly tags: Tags;
  readonly properties: Properties;
  readonly members: List<Map<string, any>>;
  readonly geometry: Geometry.RELATION | Geometry.AREA;
  public set(k: string, v: any): Relation {
    return super.set(k, v) as Relation;
  }
}

export function relationFactory(obj: {
  id: Id;
  tags?: Tags;
  properties?: Properties;
  members?: List<string>;
  geometry?: Geometry.RELATION | Geometry.AREA;
}) {
  return new Relation(obj);
}
