import { RelationMember } from './structures';

export function relationMemberFactory({
  id,
  ref,
  type,
  role,
}: {
  id: string;
  ref: string;
  type?: string;
  role?: string;
}): RelationMember {
  return {
    id,
    ref,
    role,
    type,
  };
}
