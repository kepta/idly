import { Record } from 'immutable';
import { ITags, tagsFactory } from 'src/osm/entities/tags';
import { Properties, propertiesGen } from 'src/osm/entities/properties';

export type PointLoc = number[];
export type Id = string;
export type Version = number;
export type Visible = boolean;
export type Entity = 'node' | 'relation' | 'way';

var nodeBaseRecord = Record({
  id: 'n-0',
  loc: [],
  tags: tagsFactory(),
  type: 'node',
  properties: propertiesGen()
});

// interface x {
//   id: Id;
//   tags: ITags;
//   loc: PointLoc;
//   version: Version;
//   visible: Visible;
//   type: Entity;
// }

export class Node extends nodeBaseRecord {
  id: Id;
  tags: ITags;
  loc: PointLoc;
  properties: Properties;
  type: Entity;
  set(k: string, v: any): Node {
    return <Node>super.set(k, v);
  }
}

export function nodeFactory(obj: {
  id: Id;
  tags?: ITags;
  loc?: PointLoc;
  type?: Entity;
  properties?: Properties;
}) {
  return new Node(obj);
}
