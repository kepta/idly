import { Entity, Relation, Way } from 'idly-common/lib/osm/structures';
import { entityUpdateParentRelations } from '../pure/entityUpdateParentRelations';

export function wayUpdateParents({
  prevWay,
  newWay,
  parentRelations,
  idGen,
}: {
  prevWay: Way;
  newWay: Way;
  parentRelations: Relation[];
  idGen: (e: Entity) => string;
}): ReadonlyArray<Relation> {
  return entityUpdateParentRelations(prevWay, newWay, parentRelations, idGen);
}
