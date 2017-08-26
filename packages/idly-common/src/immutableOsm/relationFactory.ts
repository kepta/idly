import { List as $List } from "immutable";
import { recordify } from "typed-immutable-record";
import { $__Relation, $Relation } from "../immutableOsm/immutableOsm";
import {
  EntityType,
  Relation,
} from "../osm/structures";
import { $attributesGen } from "./attributesGen";
import { $relationMemberGen } from "./relationMemberGen";
import { $tagsFactory } from "./tagsFactory";

export function $relationFactory(r: Relation): $Relation {
  const $tags = $tagsFactory(r.tags);
  const $attr = $attributesGen(r.attributes);
  const $members = $List(r.members.map($relationMemberGen));

  return recordify<$__Relation, $Relation>({
    id: r.id,
    type: EntityType.RELATION,
    tags: $tags,
    attributes: $attr,
    members: $members,
  });
}
