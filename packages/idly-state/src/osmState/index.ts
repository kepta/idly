import {
  Entity,
  EntityType,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';

import {
  isNotVirgin,
  isVirgin,
  setAddIterable,
  setBulkDelete,
  setCreate,
} from '../helper';
import {
  Log,
  logAddEntry,
  logCreate,
  logGetBaseIds,
  logGetCurrentIds,
  logGetEveryId,
  logGetLatestVersion,
  modifiedIdGetBaseId,
} from '../log';
import { State } from '../state/state';
import { Table } from '../table';
import { tableBulkCopy } from '../table/regular';
import { Derived, DerivedTable, derivedTableUpdate } from './derivedTable';

export type OsmTable = Table<Entity>;

export type OsmState = [State<Entity, Derived>, Log];

export const osmStateCreate: () => OsmState = (): OsmState => [
  State.create<Entity, Derived>(),
  logCreate(),
];

export function osmStateAddVirgins(
  [state]: OsmState,
  entities: Entity[],
  quadkey: string
): void {
  if (entities.some(r => isNotVirgin(r.id))) {
    throw new Error('only virgin entities can be added');
  }
  state.add(e => e.id, entities, quadkey);
}

export type OsmStateGetEntityType = (
  [state, log]: OsmState,
  id: string
) => Entity | undefined;

export const osmStateGetEntity: OsmStateGetEntityType = ([state, log], id) =>
  isVirgin(id) || logGetEveryId(log).has(id) ? state.getElement(id) : undefined;

export type OsmStateGetNextIdType = (
  [state, log]: OsmState,
  id: string
) => string;

export const osmStateGetNextId: OsmStateGetNextIdType = ([state, log], id) => {
  const virginId = modifiedIdGetBaseId(id);
  const genId = (version: number) => `${virginId}#${version}`;

  let nextVersion = logGetLatestVersion(id)(log) + 1;

  while (state.getElement(genId(nextVersion))) {
    nextVersion++;
  }

  return genId(nextVersion);
};

export type OsmStateAddModifiedsType = (
  [state, log]: OsmState,
  modifiedEntities: Entity[]
) => OsmState;

export const osmStateAddModifieds: OsmStateAddModifiedsType = (
  [state, log],
  modifiedEntities
) => {
  const all = logGetEveryId(log);

  modifiedEntities.forEach(e => {
    if (state.getElement(e.id) || all.has(e.id)) {
      throw new Error(`Modified ${e.id} already exists in table`);
    }
  });

  const newLog = logAddEntry(setCreate(modifiedEntities.map(r => r.id)))(log);

  if (newLog === log) {
    throw new Error(`Modified ids already exists in log`);
  }

  state.add(e => e.id, modifiedEntities, '');

  return [state, newLog];
};

export type OsmStateGetVisible = (
  [state, log]: OsmState,
  quadkeys: string[]
) => DerivedTable;

export const osmStateGetVisible: OsmStateGetVisible = (
  [state, log],
  quadkeys
) => {
  const visibleIds = setAddIterable(
    logGetCurrentIds(log),
    setBulkDelete(logGetBaseIds(log), state.getVisible(quadkeys))
  );

  return derivedTableUpdate(
    expandVisibleIds(visibleIds, state.getElementTable()),
    state.getMetaTable()
  );
};

const expandVisibleIds = (visibleIds: Set<string>, table: OsmTable) => {
  const result: OsmTable = new Map();

  for (const id of visibleIds) {
    const e = table.get(id) as Entity;
    result.set(id, e);

    if (e.type === EntityType.WAY) {
      e.nodes.forEach(n => {
        result.set(n, table.get(n) as Entity);
      });
    } else if (e.type === EntityType.RELATION) {
      e.members.forEach(n => {
        // table.has(n.id) && result.set(n.id, table.get(n.id) as Entity);
      });
    }
  }

  return result;
};
// following a very strict way
// 1. When shredding, shred everything but the bare minimum
//    to render the modified ids, which is exactly
//    [nodes, ways, nodesOfWays, relations].
//    - relations dont get any members as they cannot be rendered
//    - if a relation member was modified, it will be treated as an individual
//        and would get the same rules again
//    - to render ways we need node ids, so modified ways will get all of the nodesOfWays
///      for eg. if a tag was added, hypothetically we dont even need the nodes, but to
//       visualize we need the nodes, hence we will also add the nodes.
//    - all the modified nodes will be kept and everything (including all parents) would
//       be removed. If a parent did exist, it will get added automatically whenever virgin data comes
//       if a modified parent exists it will also get added, whenever the modified entities
///      are applied to state.

export type OsmStateShredType = ([state, log]: OsmState) => OsmState;

export const osmStateShred: OsmStateShredType = ([state, log]) => {
  const [newState] = osmStateCreate();
  const virginIdsToSave = logGetBaseIds(log);

  const idsToSave = setCreate<string>();

  for (const [index, entity] of state.getElementTable()) {
    if (isVirgin(index) && !virginIdsToSave.has(index)) {
      continue;
    }

    idsToSave.add(index);

    if (entity.type === EntityType.WAY) {
      entity.nodes.forEach(n => idsToSave.add(n));
    } else if (entity.type === EntityType.RELATION) {
      entity.members.forEach(m => idsToSave.add(m.id));
    }
  }

  tableBulkCopy(idsToSave, state.getElementTable(), newState.getElementTable());

  newState.getQuadkeysTable().set('', logGetEveryId(log));

  return [newState, log];
};

export type EntryFindRelatedToNodeType = (
  [state, log]: OsmState,
  nodeId: string,
  prevNodeId: string
) => Entity[];
export const entryFindRelatedToNode: EntryFindRelatedToNodeType = (
  [state, log],
  nodeId,
  prevNodeId
) => {
  const prev = state.getMetaTable().get(prevNodeId);
  if (!prev) {
    throw new Error('couldnt create entry as no derived values found' + nodeId);
  }
  const modifieds: Entity[] = [];
  prev.parentWays.forEach(way => {
    const nWay: Way = JSON.parse(
      JSON.stringify(osmStateGetEntity([state, log], way))
    );
    if (!nWay.nodes.find(n => n === prevNodeId)) {
      throw new Error(
        'node not found in claimed way ' + prevNodeId + ' ' + nWay.id
      );
    }

    modifieds.push({
      ...nWay,
      id: osmStateGetNextId([state, log], nWay.id),
      nodes: nWay.nodes.map(n => (n === prevNodeId ? nodeId : n)),
    });
  });
  prev.parentRelations.forEach(rel => {
    const nRel: Relation = JSON.parse(
      JSON.stringify(osmStateGetEntity([state, log], rel))
    );

    if (!nRel.members.find(n => n.id === prevNodeId)) {
      throw new Error(
        'node not found in claimed relation ' + prevNodeId + ' ' + nRel.id
      );
    }
    modifieds.push({
      ...nRel,
      id: osmStateGetNextId([state, log], nRel.id),
      members: nRel.members.map(
        n => (n.id === prevNodeId ? { ...n, id: nodeId, ref: nodeId } : n)
      ),
    });
  });
  return modifieds;
};
