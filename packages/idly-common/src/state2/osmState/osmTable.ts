import { Entity, EntityType, Relation, Way } from '../../osm/structures';
import { setCreate, setEqual, setSome, setUnion } from '../helper';
import {
  Log,
  logGetEverything,
  logGetLatestModifiedIds,
  logGetVirginIdsOfModifiedIds,
} from '../log';
import { State } from '../state/state';
import { OneToManyTable, Table, tableCopy } from '../table';
import { Derived, DerivedTable, updateDerivedValues } from './computedValues';

/**
 * @NOTE parentWays might not exist in the table, this is due to shredding.
 */
export type OsmElement = Entity;

export type ParentWaysTable = OneToManyTable<string>;
export type ParentRelationsTable = OneToManyTable<string>;

export type OsmTable = Table<OsmElement>;

export const osmStateCreate = (): State<Entity, Derived> =>
  State.create<Entity, Derived>();

export function osmStateAddVirgins(
  state: State<Entity>,
  entities: Entity[],
  quadkey: string
) {
  state.add(e => e.id, entities, quadkey);
}

export function osmStateAddModifieds(
  state: State<Entity>,
  newLog: Log,
  modifiedEntities: Entity[]
) {
  if (newLog.length === 0) {
    return;
  }
  // check if modified entities tally with latest log
  const latestEntry = newLog[0];

  if (
    latestEntry.size !== modifiedEntities.length ||
    modifiedEntities.some(r => !latestEntry.has(r.id))
  ) {
    throw new Error('log and modifiedEntities dont match');
  }

  modifiedEntities.forEach(e => {
    if (state.getElement(e.id)) {
      throw new Error(`Modified ${e.id} already exists in table`);
    }
  });

  osmStateAddVirgins(state, modifiedEntities, '');
}

export const osmStateGetVisible = (
  state: State<Entity>,
  quadkeys: string[],
  log: Log
): DerivedTable => {
  const visibleIds = state.getVisible(quadkeys);

  const toRemoveIds = logGetVirginIdsOfModifiedIds(log);

  for (const id of toRemoveIds) {
    visibleIds.delete(id);
  }

  for (const id of logGetLatestModifiedIds(log)) {
    visibleIds.add(id);
  }

  // return visibleIds;
  const table = state.getElementTable();

  const result: OsmTable = new Map();

  for (const id of visibleIds) {
    const e = table.get(id) as Entity;

    if (e.type === EntityType.WAY) {
      e.nodes.forEach(n => {
        result.set(n, table.get(n) as OsmElement);
      });
    } else if (e.type === EntityType.RELATION) {
      // TODO
    }
    result.set(id, e);
  }

  return updateDerivedValues(result, state.getMetaTable());
};

// PROBLEM, whenever we shred, we might
// loose virgin enttities reference by modfied Entities
// for eg w1#1 might refer to n1 in a different quadkey
// but when you remove all all non visible quadkeys
// n1 will get removed and causing problem. As a solution
// I was thinking of finding all the quadkeys indirectly referenced
// modififed entities and keeping them alive.
// To test we dont remove '' key
// const shreddedQuadkeyTable = quadkeysTableCreateFrom(
//   this._quadkeysTable,
//   quadkey
// );

// following a very strict way
// 1. When shredding, shred everything but the bare minimum
//    to render the modified ids, which exactly
//    [nodes, ways, nodesOfWays, relations].
//     ? to keep things sane we need to recompute parentWays for all
//       modified entitite?? should we or not think?
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
export const osmStateShred = (prevState: State<OsmElement>, log: Log) => {
  const newState = osmStateCreate();

  const allModifiedIds = logGetEverything(log);

  const relatedIds = osmTableGetRelatedElements(
    allModifiedIds,
    prevState.getElementTable()
  );
  osmTableCopyRow(
    prevState.getElementTable(),
    newState.getElementTable(),
    allModifiedIds
  );

  osmTableCopyRow(
    prevState.getElementTable(),
    newState.getElementTable(),
    relatedIds
  );

  newState.getQuadkeysTable().set('', allModifiedIds);

  return newState;
};

function osmTableCopyRow(src: OsmTable, dest: OsmTable, ids: Set<string>) {
  for (const id of ids) {
    tableCopy(src, dest, id);
  }
}

const osmTableGetRelatedElements = (ids: Set<string>, table: OsmTable) => {
  const result = setCreate<string>();
  for (const id of ids) {
    const element = table.get(id);
    if (!element) {
      continue;
    }
    if (element.type === EntityType.WAY) {
      element.nodes.forEach(n => result.add(n));
    } else if (element.type === EntityType.RELATION) {
      element.members.forEach(m => result.add(m.id));
    }
  }
  return result;
};
/**
 * WARNING this and osmTableApplyParentRelations  modifies osmTable
 * This function expect the osmTable's row to have
 * already been created for each entities in the param.
 * @TOFIX It could be possible that relation (maybe way) children
 * are not present. How do we fix that? How Should we handle when the
 * missing child comes back?
 *
 * From the OSM docs:
 * All ways that reference at least one node that is inside a given bounding box,
 *  any relations that reference them [the ways], and any nodes outside the bounding
 *  box that the ways may reference.
 */
