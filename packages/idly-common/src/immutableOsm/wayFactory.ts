import { $attributesGen } from './attributesGen';
import { $tagsFactory } from './tagsFactory';
import { $Way, $__Way } from '../immutableOsm';
import { Attributes, EntityId, EntityType, Tags, Way } from '../osm';
import { attributesGen } from '../osm/attributesGen';
import { recordify } from 'typed-immutable-record';
import { List as $List } from 'immutable';

export function $wayFactory(way: Way): $Way {
  var $tags = $tagsFactory(way.tags);
  var $attr = $attributesGen(way.attributes);
  var $nodes = $List(way.nodes);
  return recordify<$__Way, $Way>({
    id: way.id,
    type: EntityType.WAY,
    tags: $tags,
    attributes: $attr,
    nodes: $nodes
  });
}
