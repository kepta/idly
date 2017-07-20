import { Record, List } from 'immutable';

import { ITags, tagsFactory } from 'src/osm/others/tags';
import { Properties, propertiesGen } from 'src/osm/others/properties';
import { LngLat, genLngLat } from 'src/osm/geo_utils/lng_lat';

export type Id = string;
export type Version = number;
export type Visible = boolean;

var nodeBaseRecord = Record({
  id: 'n-0',
  loc: genLngLat([NaN, NaN]),
  tags: tagsFactory(),
  type: 'node',
  properties: propertiesGen()
});

export class Node extends nodeBaseRecord {
  id: Id;
  tags: ITags;
  type: string;
  loc: LngLat;
  properties: Properties;
  set(k: string, v: any): Node {
    return <Node>super.set(k, v);
  }
}

export function nodeFactory(obj: {
  id: Id;
  tags?: ITags;
  loc?: LngLat;
  properties?: Properties;
}) {
  return new Node(obj);
}
