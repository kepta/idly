import { Record, Map, List } from 'immutable';
// import { Node } from 'src/osm/entities/node';
import { ITags, tagsFactory } from 'src/osm/entities/tags';

import { Properties, propertiesGen } from 'src/osm/entities/properties';

type Id = string;
type Version = number;
type Visible = boolean;
type Entity = 'node' | 'way' | 'relation';

var relationBaseRecord = Record({
  id: 'w-0',
  type: 'relation',
  tags: tagsFactory(),
  properties: propertiesGen(),
  members: List()
});

export class Relation extends relationBaseRecord {
  id: Id;
  type: Entity;
  tags: ITags;
  properties: Properties;
  members: List<string>;
  set(k: string, v: any): Relation {
    return <Relation>super.set(k, v);
  }
}

export function relationFactory(obj: {
  id: Id;
  type?: Entity;
  tags?: ITags;
  properties?: Properties;
  members?: List<string>;
}) {
  return new Relation(obj);
}
