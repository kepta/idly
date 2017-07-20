import { Record, Map, List } from 'immutable';
// import { Node } from 'src/osm/entities/node';
import { ITags, tagsFactory } from 'src/osm/others/tags';

import { Properties, propertiesGen } from 'src/osm/others/properties';

type Id = string;
type Version = number;
type Visible = boolean;

var relationBaseRecord = Record({
  id: 'w-0',
  type: 'relation',
  tags: tagsFactory(),
  properties: propertiesGen(),
  members: List()
});

export class Relation extends relationBaseRecord {
  id: Id;
  type: string;
  tags: ITags;
  properties: Properties;
  members: List<Map<string, any>>;
  set(k: string, v: any): Relation {
    return <Relation>super.set(k, v);
  }
}

export function relationFactory(obj: {
  id: Id;
  tags?: ITags;
  properties?: Properties;
  members?: List<Map<string, any>>;
}) {
  return new Relation(obj);
}
