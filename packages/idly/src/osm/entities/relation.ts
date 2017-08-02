import { List, Map, Record } from 'immutable';
import { ITags, tagsFactory } from 'osm/entities/helpers/tags';

import { Properties, propertiesGen } from 'osm/entities/helpers/properties';
type Id = string;
type Version = number;
type Visible = boolean;

export class Relation extends Record({
  id: 'w-0',
  properties: propertiesGen(),
  tags: tagsFactory(),
  type: 'relation',
  members: List()
}) {
  public id: Id;
  public type: string;
  public tags: ITags;
  public properties: Properties;
  public members: List<Map<string, any>>;
  public set(k: string, v: any): Relation {
    return super.set(k, v) as Relation;
  }
}

export function relationFactory(obj: {
  id: Id;
  tags?: ITags;
  properties?: Properties;
  members?: List<string>;
}) {
  return new Relation(obj);
}
