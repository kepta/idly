import { EntityLike, RelationLike } from './entityLike';

export function relationUpdateMemberId(
  prevEntity: EntityLike,
  newEntity: EntityLike,
  relation: RelationLike
): RelationLike {
  const index = relation.members.findIndex(m => m.id === prevEntity.id);

  if (index > -1) {
    relation.members.splice(index, 1, {
      ...relation.members[index],
      id: newEntity.id,
      ref: newEntity.id,
    });
  }

  throw new Error(
    'Couldnt find entity id' + prevEntity.id + ' in relation' + relation.id
  );
}
