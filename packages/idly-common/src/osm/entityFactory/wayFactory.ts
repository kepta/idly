import { deepFreeze } from '../../misc/deepFreeze';
import { Attributes, EntityId, EntityType, Tags, Way } from '../structures';
import { attributesFactory } from './attributesFactory';
import { tagsFactory } from './tagsFactory';

export function wayFactory(
  {
    id,
    tags = tagsFactory(),
    attributes = attributesFactory(),
    nodes = [],
  }: {
    id: EntityId;
    tags?: Tags;
    attributes?: Attributes;
    nodes?: EntityId[] | ReadonlyArray<EntityId>;
  },
  freeze = true
): Way {
  return deepFreeze<Way>(
    {
      attributes: attributesFactory(attributes),
      id,
      nodes,
      tags: tagsFactory(tags),
      type: EntityType.WAY,
    },
    freeze
  );
}
