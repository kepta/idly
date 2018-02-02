import { deepFreeze } from '../../misc/deepFreeze';
import {
  Attributes,
  EntityId,
  EntityType,
  Relation,
  RelationMember,
  Tags,
} from '../structures';
import { attributesFactory } from './attributesFactory';
import { tagsFactory } from './tagsFactory';

export function relationFactory(
  {
    id,
    tags = tagsFactory(),
    attributes = attributesFactory(),
    members = [],
  }: {
    id: EntityId;
    tags?: Tags;
    attributes?: Attributes;
    members?: RelationMember[] | ReadonlyArray<RelationMember>;
  },
  freeze = true
): Relation {
  return deepFreeze<Relation>(
    {
      attributes: attributesFactory(attributes),
      id,
      members,
      tags: tagsFactory(tags),
      type: EntityType.RELATION,
    },
    freeze
  );
}
