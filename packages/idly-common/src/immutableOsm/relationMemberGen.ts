import { recordify } from 'typed-immutable-record';

import { $RelationMember } from '../immutableOsm';
import { RelationMember } from '../osm';

export function $relationMemberGen(member: RelationMember): $RelationMember {
  return recordify<RelationMember, $RelationMember>(member);
}
