import { Entity } from 'idly-common/lib/osm/structures';
import { baseId } from '../../dataStructures/log';
import {
  ReadonlyTable,
  Table,
  tableAdd,
} from '../../dataStructures/table/regular';
import { OsmState } from '../../type';
import { entitiesUnionBaseAndNodesOfWays } from '../virgin/helpers';

// http://localhost:8080/#18.73/40.7269/-74.00153 this just loads king st
// export type VirginTable = ReadonlyTable<Entity>;

// tofix make sure you only use readonly and readonly safe operators

// export function addVirgins(
//   state: OsmState,
//   entities: Entity[],
//   quadkey: string
// ): OsmState {
// if (entities.some(r => isNotVirgin(r.id))) {
//   throw new Error('only virgin entities can be added');
// }
// const isParentOfModified: Array<[Way, string[]]> = [];
// for (const e of entities) {
//   if (e.type === EntityType.NODE || state.modified.has(e.id)) {
//     continue;
//   }
//   if (e.type === EntityType.WAY) {
//     const foundNodes = e.nodes.filter(n => state.modified.has(n));
//     if (foundNodes.length > 0) {
//       isParentOfModified.push([e, foundNodes]);
//     }
//   }
// }
// const getBaseIds = e => [...e].map(r => modifiedIdGetBaseId(r));
// let log = state.log;
// let modified = state.modified;
// if (isParentOfModified.length > 0) {
//   modified = new Map(modified);
//   isParentOfModified.forEach(([entity, foundNodes]) => {
//     log = logRewrite(log, entity.id, new Set(foundNodes));
//     log
//       .slice(0)
//       .reverse()
//       .map(e => [...e])
//       .map(ids => [
//         ids[ids.map(modifiedIdGetBaseId).indexOf(entity.id)],
//         ids.filter(i => entity.nodes.indexOf(modifiedIdGetBaseId(i)) > -1),
//       ])
//       .filter(([id]) => id)
//       .forEach(([id, modifiedNodeIds]) => {
//         const newWay = {
//           ...entity,
//           id,
//           nodes: entity.nodes.map(r => {
//             if (modifiedNodeIds.find(mN => modifiedIdGetBaseId(mN) === r)) {
//               return modifiedNodeIds.find(
//                 mN => modifiedIdGetBaseId(mN) === r
//               );
//             }
//             return r;
//           }),
//         };
//         modified.set(newWay.id, newWay);
//         if (!modified.has(entity.id)) {
//           modified.set(entity.id, entity);
//         }
//       });
//   });
// }
// }

export function modifiedGetEntity(
  modified: ReadonlyTable<Entity>,
  id: string
): Entity | undefined {
  return modified.get(id);
}

function debugModifiedAddModifiedEntities(
  table: OsmState['modified'],
  virginTable: OsmState['virgin'],
  modifiedEntities: Entity[]
) {
  modifiedEntities.forEach(e => {
    const id = baseId(e.id);
    if (!table.has(id)) {
      if (!virginTable.elements.get(id)) {
        throw new Error('virgin table doesnt have ' + id);
      }
    }
  });
}

export function modifiedAddModifiedEntitiesAndRelated(
  modified: OsmState['modified'],
  virgin: OsmState['virgin'],
  modifiedEntities: Entity[]
): Table<Entity> {
  debugModifiedAddModifiedEntities(modified, virgin, modifiedEntities);

  return entitiesUnionBaseAndNodesOfWays(modifiedEntities, virgin)
    .filter(r => !modified.has(r.id))
    .reduce((cTable, cur) => tableAdd(cur, cur.id, cTable), new Map(modified));
}
