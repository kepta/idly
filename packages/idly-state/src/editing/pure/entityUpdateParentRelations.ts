import { Node, Relation, Way } from 'idly-common/lib/osm/structures';
import { relationUpdateMemberId } from './relationUpdateMemberId';

export function entityUpdateParentRelations(
  prevEntity: Way | Node,
  newEntity: Way | Node,
  parentRelations: ReadonlyArray<Relation>,
  newRelationIdGen: (r: Relation) => string
): ReadonlyArray<Relation> {
  return parentRelations.map(r =>
    relationUpdateMemberId(prevEntity, newEntity, r, newRelationIdGen(r))
  );
}
