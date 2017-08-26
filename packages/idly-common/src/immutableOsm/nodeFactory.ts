import { $attributesGen } from './attributesGen';
import { $genLngLat } from './genLngLat';
import { $tagsFactory } from './tagsFactory';
import { $Node, $__Node } from '../immutableOsm';
import { genLngLat } from '../osm/genLngLat';
import { attributesGen } from '../osm/attributesGen';
import { Attributes, EntityId, EntityType, LngLat, Node, Tags } from '../osm';
import { recordify } from 'typed-immutable-record';

export function nodeFactory(n: Node): $Node {
  var $tags = $tagsFactory(n.tags);
  var $loc = $genLngLat(n.loc);
  var $attr = $attributesGen(n.attributes);
  return recordify<$__Node, $Node>({
    id: n.id,
    tags: $tags,
    type: EntityType.NODE,
    loc: $loc,
    attributes: $attr
  });
}
