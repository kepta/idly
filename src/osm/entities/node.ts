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
 *  converted it to an object.
 * @REVISIT I think this ^^ bug was due
 *  to cyclic dependcies which I have fixed now.
 *  Enum should in paper work.
 */
console.log('circuledep chec', Geometries.POINT);
export class Node extends Record({
  id: 'n-0',
  loc: genLngLat([NaN, NaN]),
  tags: tagsFactory(),
  type: 'node',
  properties: propertiesGen(),
  geometry: Geometries.POINT
}) {
  readonly id: Id;
  readonly tags: ITags;
  readonly type: string;
  readonly loc: LngLat;
  readonly properties: Properties;
  readonly geometry: Geometries.POINT | Geometries.VERTEX;
  public set(k: string, v: any): Node {
    return super.set(k, v) as Node;
  }
}

export function nodeFactory(obj: {
  id: Id;
  tags?: ITags;
  loc?: LngLat;
  properties?: Properties;
  geometry?: Geometries.POINT | Geometries.VERTEX;
}) {
  return new Node(obj);
}
