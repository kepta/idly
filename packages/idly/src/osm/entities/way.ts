import { Record, Map, List } from 'immutable';
// import { Node } from 'src/osm/entities/node';
import { ITags, tagsFactory } from 'src/osm/entities/tags';

import { Properties, propertiesGen } from 'src/osm/entities/properties';

type Id = string;
type Version = number;
type Visible = boolean;
type Entity = 'node' | 'relation' | 'way';
// type Nodes = Map<string, Node>;

var wayBaseRecord = Record({
  id: 'w-0',
  type: 'way',
  tags: tagsFactory(),
  properties: propertiesGen(),
  nodes: List()
});

export class Way extends wayBaseRecord {
  id: Id;
  type: Entity;
  tags: ITags;
  properties: Properties;
  nodes: List<string>;
  set(k: string, v: any): Way {
    return <Way>super.set(k, v);
  }
}

export function wayFactory(obj: {
  id: Id;
  type?: Entity;
  tags?: ITags;
  properties?: Properties;
  nodes?: List<string>;
}) {
  return new Way(obj);
}
