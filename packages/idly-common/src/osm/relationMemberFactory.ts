import { RelationMember } from './structures';
export function relationMemberFactory({
  id,
  type,
  role,
}: {
  id?: string;
  type?: string;
  role?: string;
}): RelationMember {
  return {
    id,
    role,
    type,
  };
}
