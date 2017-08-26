import { attributesGen } from '../osm/attributesGen';
import {
  Attributes,
  EntityId,
  EntityType,
  Relation,
  RelationMember,
  Tags
} from '../osm/structures';

export function relationFactory({
  id,
  tags = new Map(),
  attributes = attributesGen({}),
  members = []
}: {
  id: EntityId;
  tags?: Tags;
  attributes?: Attributes;
  members?: RelationMember[];
}): Relation {
  return {
    id,
    type: EntityType.RELATION,
    tags,
    attributes,
    members
  };
}
