import { deepFreeze } from '../misc/deepFreeze';
import { attributesGen } from '../osm/attributesGen';
import {
  Attributes,
  Entity,
  EntityId,
  EntityType,
  Relation,
  RelationMember,
  Tags,
} from '../osm/structures';
import { tagsFactory } from './tagsFactory';

export function relationFactory(
  {
    id,
    tags = tagsFactory(),
    attributes = attributesGen(),
    members = [],
  }: {
    id: EntityId;
    tags?: Tags;
    attributes?: Attributes;
    members?: RelationMember[] | ReadonlyArray<RelationMember>;
  },
  freeze = true,
): Relation {
  return deepFreeze<Relation>(
    {
      attributes,
      id,
      members,
      tags,
      type: EntityType.RELATION,
    },
    freeze,
  );
}
