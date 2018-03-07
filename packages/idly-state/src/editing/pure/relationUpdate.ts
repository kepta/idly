import { relationFactory } from 'idly-common/lib/osm/entityFactory';
import { Relation } from 'idly-common/lib/osm/structures';
import { relationClone } from './relationClone';

export function relationUpdate(
  obj: Partial<Relation> & { id: string },
  unsafeRelation: Relation
): Relation {
  const relation = relationClone(unsafeRelation);
  return relationFactory(Object.assign({}, relation, obj));
}
