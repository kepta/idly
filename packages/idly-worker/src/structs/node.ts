import { EntityId } from 'structs';
import { EntityType, Geometry } from 'structs/geometry';
import { genLngLat, LngLat } from 'structs/lngLat';
import { Properties, propertiesGen } from 'structs/properties';
import { Tags } from 'structs/tags';

export interface Node {
  readonly id: EntityId;
  readonly tags: Tags;
  readonly type: EntityType.NODE;
  readonly loc: LngLat;
  readonly properties: Properties;
}

export function nodeFactory({
  id,
  tags = new Map(),
  loc = genLngLat([0, 0]),
  properties = propertiesGen({})
}: {
  id: EntityId;
  tags?: Tags;
  loc?: LngLat;
  properties?: Properties;
}): Node {
  return {
    id,
    tags,
    type: EntityType.NODE,
    loc,
    properties
  };
}
