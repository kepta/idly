export interface Member {
  readonly id: string;
  readonly type: string;
  readonly role: string;
}

export function memberGen({
  id,
  type,
  role
}: {
  id?: string;
  type?: string;
  role?: string;
}): Member {
  return {
    id,
    type,
    role
  };
}
