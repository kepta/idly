import { Attributes, EntityId, EntityType, Tags, Way } from '../osm';
import { attributesGen } from '../osm/attributesGen';

export function wayFactory({
  id,
  tags = new Map(),
  attributes = attributesGen({}),
  nodes = []
}: {
  id: EntityId;
  tags?: Tags;
  attributes?: Attributes;
  nodes?: EntityId[];
}): Way {
  return {
    id,
    type: EntityType.WAY,
    tags,
    attributes,
    nodes
  };
}
