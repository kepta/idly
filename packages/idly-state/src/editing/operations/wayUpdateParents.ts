import {
  Entity,
  EntityType,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { Table } from '../../table';
import { entityUpdateParentRelations } from '../helpers/entityUpdateParentRelations';
import { sureGet } from './sureGet';

export function wayUpdateParents(
  prevWay: Way,
  newWay: Way,
  parentRelationsTable: Table<Relation[]>,
  idGen: (e: Entity) => string
): ReadonlyArray<Relation> {
  const parentRelations = sureGet(prevWay.id, parentRelationsTable);

  return entityUpdateParentRelations(prevWay, newWay, parentRelations, idGen);
}
