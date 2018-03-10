import { Entity, Relation } from 'idly-common/lib/osm/structures';
import { baseId } from '../../dataStructures/log';
import { relationUpdate } from './relationUpdate';

export function relationUpdateMemberId(
  prevEntity: Entity,
  newEntity: Entity,
  prevRelation: Relation,
  newRelationId: string
): Relation {
  const prevId = baseId(prevEntity.id);

  return relationUpdate(
    {
      id: newRelationId,
      members: prevRelation.members.map(
        n =>
          baseId(n.id) === prevId
            ? { ...n, id: newEntity.id, ref: newEntity.id }
            : n
      ),
    },
    prevRelation
  );
}
