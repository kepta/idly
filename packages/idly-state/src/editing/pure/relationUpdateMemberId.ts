import { Entity, Relation } from 'idly-common/lib/osm/structures';
import { relationUpdate } from './relationUpdate';

export function relationUpdateMemberId(
  prevEntity: Entity,
  newEntity: Entity,
  prevRelation: Relation,
  newRelationId: string
): Relation {
  return relationUpdate(
    {
      id: newRelationId,
      members: prevRelation.members.map(
        n =>
          n.id === prevEntity.id
            ? { ...n, id: newEntity.id, ref: newEntity.id }
            : n
      ),
    },
    prevRelation
  );
}
