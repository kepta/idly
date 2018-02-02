import { lngLatFactory } from '../../geo/lngLatFactory';
import { deepFreeze } from '../../misc/deepFreeze';

import {
  Attributes,
  EntityId,
  EntityType,
  LngLat,
  Node,
  Tags,
} from '../structures';
import { attributesFactory } from './attributesFactory';
import { tagsFactory } from './tagsFactory';

export function nodeFactory(
  {
    id,
    tags = tagsFactory(),
    loc = lngLatFactory([0, 0]),
    attributes = attributesFactory(),
  }: {
    id: EntityId;
    tags?: Tags;
    loc?: LngLat;
    attributes?: Attributes;
  },
  freeze = true
): Node {
  return deepFreeze<Node>(
    {
      attributes: attributesFactory(attributes),
      id,
      loc,
      tags: tagsFactory(tags),
      type: EntityType.NODE,
    },
    freeze
  );
}
