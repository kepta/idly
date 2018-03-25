import { Relation } from 'idly-common/lib/osm/structures';
import { Derived, RelevantGeometry } from '../types';

export interface EnsuredMemberType {
  member: Relation['members'][0];
  derived: Derived;
  geometry: RelevantGeometry;
}

export function ensureMembers(
  relationMembers: Relation['members'],
  table: Map<string, Derived>,
  lookup: WeakMap<Derived, RelevantGeometry>
): EnsuredMemberType[] | undefined {
  const result = relationMembers.map((m): EnsuredMemberType | undefined => {
    const d = table.get(m.id);
    if (!d) {
      return;
    }
    const g = lookup.get(d);
    if (!g) {
      return;
    }

    return {
      derived: d,
      geometry: g,
      member: m,
    };
  });

  if (result.some(r => !r)) {
    return undefined;
  }

  return result as EnsuredMemberType[];
}
