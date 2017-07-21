import { Record, Map, List } from 'immutable';
import { ITags, tagsFactory } from 'osm/others/tags';

import { Properties, propertiesGen } from 'osm/others/properties';

type Id = string;
type Version = number;
type Visible = boolean;
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
  type: string;
  tags: ITags;
  properties: Properties;
  nodes: List<string>;
  set(k: string, v: any): Way {
    return <Way>super.set(k, v);
  }
}

export function wayFactory(obj: {
  id: Id;
  tags?: ITags;
  properties?: Properties;
  nodes?: List<string>;
}) {
  return new Way(obj);
}
