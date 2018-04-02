import { Relation } from 'idly-common/lib/osm/structures';
import { HighlightColor } from 'idly-common/lib/styling/highlight';
import { RelevantGeometry } from '../types';
import { EnsuredMemberType } from './helpers';

export function turnRestriction(
  relation: Relation,
  ensuredMembers: EnsuredMemberType[],
  displayName: string
): RelevantGeometry[] | undefined {
  if (!relation.tags.type || !relation.tags.type.startsWith('restriction')) {
    return;
  }

  const ROLE = ['from', 'via', 'to'];
  const result = [];

  const restrictiveToValue = makeToHighlightColor(relation.tags);

  for (const role of ROLE) {
    const matchingMember = ensuredMembers.filter(
      ({ member }) => member.role === role
    );

    // each role needs to have a minimum of 1
    if (matchingMember.length === 0) {
      return;
    }

    for (const { member, geometry } of matchingMember) {
      let highlightColor = HighlightColor.KIND_UNIMPORTANT;

      if (role === 'to' && restrictiveToValue === 'no') {
        highlightColor = HighlightColor.KIND_NEVER;
      }

      if (role === 'to' && restrictiveToValue === 'only') {
        highlightColor = HighlightColor.KIND_ONLY;
      }

      if (role === 'from') {
        highlightColor = HighlightColor.KIND_NORMAL;
      }

      result.push({
        ...geometry,
        id: relation.id,
        properties: {
          '@idly-geometry':
            geometry.properties && geometry.properties['@idly-geometry'],
          '@idly-highlight': highlightColor,
          '@idly-member-id': member.id,
          '@idly-preset-name': displayName || 'Turn Restriction',
          '@idly-relation-role': `${role}/${displayName.slice(0, 14)}`,
          '@idly-relation-type': 'turn-restriction',
          id: relation.id,
        },
      });
    }
  }

  return result;
}

function makeToHighlightColor(
  tags: Record<string, string>
): 'no' | 'only' | undefined {
  for (const key of Object.keys(tags)) {
    const value = tags[key];
    if (key.startsWith('restriction')) {
      if (value.startsWith('no_')) {
        return 'no';
      }
      if (value.startsWith('only_')) {
        return 'only';
      }
    }
  }
  return undefined;
}
