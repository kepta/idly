import { Record } from 'immutable';

import { Geometries } from 'osm/entities/constants';
import { Properties, propertiesGen } from 'osm/entities/helpers/properties';
import { ITags, tagsFactory } from 'osm/entities/helpers/tags';
import { genLngLat, LngLat } from 'osm/geo_utils/lng_lat';

export type Id = string;
export type Version = number;
export type Visible = boolean;

/**
 * @BUG cant use enum Geometries
 *  Need more investigation, for now
 *  converted it to an object
 */
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

console.log(Geometries);
