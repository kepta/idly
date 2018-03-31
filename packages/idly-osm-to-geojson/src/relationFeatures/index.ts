import { Relation } from 'idly-common/lib/osm/structures';
import { Derived, RelevantGeometry } from '../types';
import { ensureMembers } from './helpers';
import { relationPresetMatch } from './relationPresetMatch';
import { turnRestriction } from './turnRestriction';

export function relationFeatures(
  derived: Derived<Relation>,
  table: Map<string, Derived>,
  geometryTable: WeakMap<Derived, RelevantGeometry>
): RelevantGeometry[] | undefined {
  const relation = derived.entity;
  const { match } = relationPresetMatch(derived);

  const ensured = ensureMembers(relation.members, table, geometryTable);
  if (!ensured) {
    return;
  }

  return turnRestriction(relation, ensured, match.name({}));
}
