import { genLngLat } from '../osm/genLngLat';
import { attributesGen } from '../osm/attributesGen';
import {
  Attributes,
  EntityId,
  EntityType,
  LngLat,
  Node,
  Tags
} from '../osm/structures';

export function nodeFactory({
  id,
  tags = new Map(),
  loc = genLngLat([0, 0]),
  attributes = attributesGen({})
}: {
  id: EntityId;
  tags?: Tags;
  loc?: LngLat;
  attributes?: Attributes;
}): Node {
  return {
    id,
    tags,
    type: EntityType.NODE,
    loc,
    attributes
  };
}
