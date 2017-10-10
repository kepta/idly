// import { weakCache2 } from 'idly-common/lib/misc/weakCache';
// import {
//   Entity,
//   EntityId,
//   NodeId,
//   WayId
// } from 'idly-common/lib/osm/structures';
// import { List as ImList, Map as ImMap, Set as ImSet } from 'immutable';

// export type ParentWays = ImMap<NodeId, ImSet<WayId>>;
// export type EntityTable = ImMap<EntityId, Entity>;

// export const entityTableGen: (
//   entityTable: EntityTable,
//   entities: ImList<Entity>
// ) => EntityTable = weakCache2(
//   (entityTable: EntityTable, entities: ImList<Entity>): EntityTable => {
//     return entityTable.withMutations(m => {
//       entities.forEach(e => m.set(e.id, e));
//     });
//   }
// );
