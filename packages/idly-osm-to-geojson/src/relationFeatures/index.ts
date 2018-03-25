import { Relation } from 'idly-common/lib/osm/structures';
import { Derived, RelevantGeometry } from '../types';
import { ensureMembers } from './helpers';
import { turnRestriction } from './turnRestriction';

export function relationFeatures(
  relation: Relation,
  table: Map<string, Derived>,
  geometryTable: WeakMap<Derived, RelevantGeometry>
): RelevantGeometry[] | undefined {
  const ensured = ensureMembers(relation.members, table, geometryTable);
  if (!ensured) {
    return;
  }
  return turnRestriction(relation, ensured);
}
