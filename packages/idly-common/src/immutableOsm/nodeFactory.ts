import { recordify } from 'typed-immutable-record';
import { $__Node, $Node } from '../immutableOsm/immutableOsm';
import { EntityType, Node } from '../osm/structures';
import { $attributesGen } from './attributesGen';
import { $genLngLat } from './genLngLat';
import { $tagsFactory } from './tagsFactory';

export function $nodeFactory(n: Node): $Node {
  const $tags = $tagsFactory(n.tags);
  const $loc = $genLngLat(n.loc);
  const $attr = $attributesGen(n.attributes);
  return recordify<$__Node, $Node>({
    id: n.id,
    tags: $tags,
    type: EntityType.NODE,
    loc: $loc,
    attributes: $attr
  });
}
