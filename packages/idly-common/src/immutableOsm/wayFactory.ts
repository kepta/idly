import { List as $List } from 'immutable';
import { recordify } from 'typed-immutable-record';
import { $__Way, $Way } from '../immutableOsm/immutableOsm';
import { EntityType, Way } from '../osm/structures';
import { $attributesGen } from './attributesGen';
import { $tagsFactory } from './tagsFactory';

export function $wayFactory(way: Way): $Way {
  const $tags = $tagsFactory(way.tags);
  const $attr = $attributesGen(way.attributes);
  const $nodes = $List(way.nodes.map(r => r));
  return recordify<$__Way, $Way>({
    id: way.id,
    type: EntityType.WAY,
    tags: $tags,
    attributes: $attr,
    nodes: $nodes
  });
}
