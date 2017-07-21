import { List, Record } from 'immutable';

import { genLngLat, LngLat } from 'osm/geo_utils/lng_lat';
import { Properties, propertiesGen } from 'osm/others/properties';
import { ITags, tagsFactory } from 'osm/others/tags';

export type Id = string;
export type Version = number;
export type Visible = boolean;

export class Node extends Record({
  id: 'n-0',
  loc: genLngLat([NaN, NaN]),
  tags: tagsFactory(),
  type: 'node',
  properties: propertiesGen()
}) {
  public id: Id;
  public tags: ITags;
  public type: string;
  public loc: LngLat;
  public properties: Properties;
  public set(k: string, v: any): Node {
    return super.set(k, v) as Node;
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
