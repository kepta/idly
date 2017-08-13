import { List, Record } from 'immutable';
import { Tags, tagsFactory } from 'osm/entities/helpers/tags';

import { Geometry } from 'osm/entities/constants';
import { Properties, propertiesGen } from 'osm/entities/helpers/properties';

type Id = string;
type Version = number;
type Visible = boolean;

const wayBaseRecord = Record({
  id: 'w-0',
  type: 'way',
  tags: tagsFactory(),
  properties: propertiesGen(),
  nodes: List(),
  /**
   * @TOFIX urgent remove this asap
   */
  geometry: Geometry.LINE
});

export class Way extends wayBaseRecord {
  readonly id: Id;
  readonly type: string;
  readonly tags: Tags;
  readonly properties: Properties;
  readonly nodes: List<string>;
  public set(k: string, v: any): Way {
    return super.set(k, v) as Way;
  }
}

export function wayFactory(obj: {
  id: Id;
  tags?: Tags;
  properties?: Properties;
  nodes?: List<string>;
}) {
  return new Way(obj);
}
