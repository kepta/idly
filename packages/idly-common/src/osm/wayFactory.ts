import { deepFreeze } from '../misc/deepFreeze';
import { attributesGen } from '../osm/attributesGen';
import { Attributes, EntityId, EntityType, Tags, Way } from '../osm/structures';
import { tagsFactory } from './tagsFactory';

export function wayFactory(
  {
    id,
    tags = tagsFactory(),
    attributes = attributesGen(),
    nodes = [],
  }: {
    id: EntityId;
    tags?: Tags;
    attributes?: Attributes;
    nodes?: EntityId[] | ReadonlyArray<EntityId>;
  },
  freeze = true,
): Way {
  return deepFreeze<Way>(
    {
      attributes,
      id,
      nodes,
      tags,
      type: EntityType.WAY,
    },
    freeze,
  );
}
