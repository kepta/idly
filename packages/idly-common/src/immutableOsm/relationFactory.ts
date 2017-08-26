import { List as $List } from 'immutable';
import { $relationMemberGen } from './relationMemberGen';
import { $attributesGen } from './attributesGen';
import { $tagsFactory } from './tagsFactory';
import { $Relation, $__Relation } from '../immutableOsm';
import { attributesGen } from '../osm/attributesGen';
import {
  Attributes,
  EntityId,
  EntityType,
  Relation,
  RelationMember,
  Tags
} from '../osm';
import { recordify } from 'typed-immutable-record';

export function $relationFactory(r: Relation): $Relation {
  var $tags = $tagsFactory(r.tags);
  var $attr = $attributesGen(r.attributes);
  var $members = $List(r.members.map($relationMemberGen));

  return recordify<$__Relation, $Relation>({
    id: r.id,
    type: EntityType.RELATION,
    tags: $tags,
    attributes: $attr,
    members: $members
  });
}
