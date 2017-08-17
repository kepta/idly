import { EntityId } from 'structs';
import { EntityType, Geometry } from 'structs/geometry';
import { genLngLat, LngLat } from 'structs/lngLat';
import { Properties, propertiesGen } from 'structs/properties';
import { Tags } from 'structs/tags';

export interface Way {
  readonly id: EntityId;
  readonly type: EntityType.WAY;
  readonly tags: Tags;
  readonly properties: Properties;
  readonly nodes: EntityId[];
}

export function wayFactory({
  id,
  tags = new Map(),
  properties = propertiesGen({}),
  nodes = []
}: {
  id: EntityId;
  tags?: Tags;
  properties?: Properties;
  nodes?: EntityId[];
}): Way {
  return {
    id,
    type: EntityType.WAY,
    tags,
    properties,
    nodes
  };
}
