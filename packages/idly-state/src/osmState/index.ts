import {
  Entity,
  EntityType,
  LngLat,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { stateGenNextId } from '..';
import { nodeMove } from '../editing/operations/nodeMove';
import { isNotVirgin, setCreate, setDifference, setUnion } from '../helper';
import {
  baseId,
  Log,
  logAddEntry,
  logGetBaseIds,
  logGetEveryId,
  logGetLatestVersion,
} from '../log';
import { VirginState } from '../state/state';
import { entitiesExpandToBaseAndRelated } from '../stateHelpers';
import { genNextId } from '../stateHelpers/genNextId';
import { ReadonlyTable, tableAdd, Table } from '../table/regular';
import { OsmState } from '../type';
import { DerivedTable } from './derivedTable';

// http://localhost:8080/#18.73/40.7269/-74.00153 this just loads king st
export type OsmTable = ReadonlyTable<Entity>;
// export type VirginTable = ReadonlyTable<Entity>;
export type ChangedTable = ReadonlyTable<Entity>;

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
//   if (e.type === EntityType.NODE || state.changedTable.has(e.id)) {
//     continue;
//   }
//   if (e.type === EntityType.WAY) {
//     const foundNodes = e.nodes.filter(n => state.changedTable.has(n));
//     if (foundNodes.length > 0) {
//       isParentOfModified.push([e, foundNodes]);
//     }
//   }
// }
// const getBaseIds = e => [...e].map(r => modifiedIdGetBaseId(r));
// let log = state.log;
// let changedTable = state.changedTable;
// if (isParentOfModified.length > 0) {
//   changedTable = new Map(changedTable);
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
//         changedTable.set(newWay.id, newWay);
//         if (!changedTable.has(entity.id)) {
//           changedTable.set(entity.id, entity);
//         }
//       });
//   });
// }
// }

function debugOsmStateGetEntity(state: OsmState, id: string) {
  const logEveryId = logGetEveryId(state.log);

  if (
    (logEveryId.has(id) && !state.changedTable.has(id)) ||
    (!logEveryId.has(id) && state.changedTable.has(id) && isNotVirgin(id))
  ) {
    throw new Error('state and log have gone incosistent for ' + id);
  }
}

export function changedTableGetEntity(
  changedTable: ReadonlyTable<Entity>,
  log: Log,
  id: string
): Entity | undefined {
  return changedTable.get(id);
}

export type OsmStateGetEntityType = (
  state: OsmState,
  id: string
) => Entity | undefined;

// @TOFIX Delete it after you take care of shit below
export const osmStateGetEntity: OsmStateGetEntityType = (state, id) => {
  debugOsmStateGetEntity(state, id);

  return state.changedTable.get(id) || state.virgin.elements.get(id);
};

export type OsmStateGetNextIdType = (log: Log, id: string) => string;

export const getLatestId: OsmStateGetNextIdType = (log, id) => {
  const virginId = baseId(id);
  const genId = (version: number) => `${virginId}#${version}`;
  const c = logGetLatestVersion(id)(log);
  if (c === -1) {
    return id;
  }

  return genId(c);
};

function debugChangedTableAddModifiedEntities(
  table: ChangedTable,
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

export function changedTableAddModifiedEntities(
  changedTable: ChangedTable,
  virginTable: OsmState['virgin'],
  modifiedEntities: Entity[]
): Table<Entity> {
  debugChangedTableAddModifiedEntities(
    changedTable,
    virginTable,
    modifiedEntities
  );

  const newCTable = new Map(changedTable);

  modifiedEntities = entitiesExpandToBaseAndRelated(
    modifiedEntities,
    virginTable.elements
  );

  modifiedEntities.forEach(r => {
    const e = newCTable.get(r.id);
    if (!e) {
      tableAdd(r, r.id, newCTable);
    }
  });

  return newCTable;
}

// NOTE: this has a dependedency on the osmMetatable
// if osmMetatable hasnt been executed this would fail
export type EntryFindRelatedToNodeType = (
  state: OsmState,
  prevNodeId: string,
  loc: LngLat
) => Entity[];
export const entryFindRelatedToNode: EntryFindRelatedToNodeType = (
  state,
  prevNodeId,
  loc
) => {
  prevNodeId = getLatestId(state.log, prevNodeId);
  const prev = state.derivedTable.get(prevNodeId);

  if (!prev) {
    throw new Error(
      'couldnt create entry as no derived values found' + prevNodeId
    );
  }

  const pWays = prev.parentWays;

  const pWaysTable = new Map<string, Way[]>([
    [prevNodeId, expandIds(prev.parentWays, state.derivedTable) as any],
  ]);

  const pRelTable = new Map<string, Relation[]>([
    [prevNodeId, expandIds(prev.parentRelations, state.derivedTable) as any],
  ]);

  for (const wayId of pWays) {
    const d = state.derivedTable.get(wayId);
    if (!d) {
      throw new Error('couldnt find direcieed table ' + wayId);
    }

    pRelTable.set(wayId, expandIds(
      d.parentRelations,
      state.derivedTable
    ) as any);
  }

  return nodeMove(prev.entity as any, loc, pWaysTable, pRelTable, (e: Entity) =>
    stateGenNextId(state, e.id)
  );
};

function expandIds(
  ids: IterableIterator<string> | Iterable<string>,
  table: DerivedTable
): Entity[] {
  const res = [];
  for (const id of ids) {
    const e = table.get(id);
    if (!e) {
      throw new Error('id not found!');
    }
    res.push(e.entity);
  }
  return res;
}
