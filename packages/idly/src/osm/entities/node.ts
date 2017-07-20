import { Record } from 'immutable';

import { ITags, tagsFactory } from 'src/osm/others/tags';
import { Properties, propertiesGen } from 'src/osm/others/properties';

export type PointLoc = number[];
export type Id = string;
export type Version = number;
export type Visible = boolean;

var nodeBaseRecord = Record({
  id: 'n-0',
  loc: [],
  tags: tagsFactory(),
  type: 'node',
  properties: propertiesGen()
});

export class Node extends nodeBaseRecord {
  id: Id;
  tags: ITags;
  type: string;
  loc: PointLoc;
  properties: Properties;
  set(k: string, v: any): Node {
    return <Node>super.set(k, v);
  }
}

export function nodeFactory(obj: {
  id: Id;
  tags?: ITags;
  loc?: PointLoc;
  properties?: Properties;
}) {
  return new Node(obj);
}
