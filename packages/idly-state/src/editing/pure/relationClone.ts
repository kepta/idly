import { relationFactory } from 'idly-common/lib/osm/entityFactory';
import { Relation } from 'idly-common/lib/osm/structures';

export function relationClone(relation: Relation): Relation {
  return relationFactory({
    attributes: { ...relation.attributes },
    id: relation.id,
    members: relation.members.slice(),
    tags: { ...relation.tags },
  });
}
