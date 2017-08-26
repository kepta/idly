import { RelationMember } from '../osm/structures';
export function relationMemberGen({
  id,
  type,
  role
}: {
  id?: string;
  type?: string;
  role?: string;
}): RelationMember {
  return {
    id,
    type,
    role
  };
}
