import { List, Map, Record } from 'immutable';
import { ITags, tagsFactory } from 'osm/others/tags';

import { Properties, propertiesGen } from 'osm/others/properties';

type Id = string;
type Version = number;
type Visible = boolean;

const wayBaseRecord = Record({
  id: 'w-0',
  type: 'way',
  tags: tagsFactory(),
  properties: propertiesGen(),
  nodes: List()
});

export class Way extends wayBaseRecord {
  public id: Id;
  public type: string;
  public tags: ITags;
  public properties: Properties;
  public nodes: List<string>;
  public set(k: string, v: any): Way {
    return super.set(k, v) as Way;
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
