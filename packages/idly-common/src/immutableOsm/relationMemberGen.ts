import { recordify } from 'typed-immutable-record';

import { $RelationMember } from '../immutableOsm/immutableOsm';
import { RelationMember } from '../osm/structures';

export function $relationMemberGen(member: RelationMember): $RelationMember {
  return recordify<RelationMember, $RelationMember>(member);
}
