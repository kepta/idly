import { Entity, EntityType, Way } from 'idly-common/lib/osm/structures';
import { Identity } from 'monet';
import {
  logAddEntry,
  logCreate,
  logGetBaseIds,
  logGetCurrentIds,
} from './dataStructures/log';
import {
  setAddIterable,
  setBulkDelete,
  setClone,
  setCreate,
} from './dataStructures/set';
import { logIntroduceEntity } from './editing/logIntroduceEntity';
import { DerivedTable, derivedTableUpdate } from './state/derivedTable/index';
import { modifiedAddModifiedEntitiesAndRelated } from './state/modified';
import {
  virginAddElements,
  virginGetInQuadkeys,
  VirginState,
  virginStateCreate,
} from './state/virgin/index';
import { consistencyChecker } from './stateHelpers/consistencyChecker';
import { genNextId } from './stateHelpers/genNextId';
import { getEntity } from './stateHelpers/getEntity';
import { getRenderableEntities } from './stateHelpers/osmState';
import { OsmState } from './type';

/**
 * Rules of the osm game
 * 1. If a way is given all nodes inside it are also supplied, (NOT YET DISPROVEN)
 * 2. If a relation comes, the members may not be supplied (PROVEN)
 * 3. If a node exists, its parentWays & parentRelations are non deterministic.
 *     You can come close but will never knw for sure
 *
 * Our habbits
 * 1. We dont let the relation itself be modified unless its fully avaialble
 * 2. Relation as modification as a byproduct of one of its members is okay
 * 3. Even if relation is r3#1 (ie modified) we cannot let it modify unless its fully downloaded
 */

export function stateCreate(
  virgin: VirginState<Entity> = virginStateCreate(),
  modified = new Map(),
  derivedTable = new Map(),
  log = logCreate()
): OsmState {
  return {
    derivedTable,
    log,
    modified,
    virgin,
  };
}

export function stateGetEntity(
  state: OsmState,
  id: string
): Entity | undefined {
  consistencyChecker(state);
  return getEntity(id, state);
}

/**
 *
 * The derivedTable is making things pretty
 * non functional, stateGetVisibles magically updates
 * derivedTable, others cant access derivedTable without
 * knowing. Maybe the solution is to add quadkey in the osmState
 * so that anyone can compute derivedTable?
 */
export function stateGetVisibles(
  state: OsmState,
  quadkeys: string[]
): DerivedTable {
  consistencyChecker(state);
  return Identity(
    setClone(virginGetInQuadkeys(state.virgin.quadkeysTable, quadkeys))
  )
    .map(visibleIds => setBulkDelete(logGetBaseIds(state.log), visibleIds))
    .map(visibleIds => setAddIterable(logGetCurrentIds(state.log), visibleIds))
    .map(visibleIds => getRenderableEntities(visibleIds, state))
    .map(entityTable => derivedTableUpdate(entityTable, state.derivedTable))
    .get();
}

export function stateIntroduceEntities(state: OsmState, entities: Entity[]) {
  console.time('int');
  const mod = new Map(state.modified);
  let allBaseIds = logGetBaseIds(state.log);
  for (const e of entities) {
    if (e.type === EntityType.NODE || state.modified.has(e.id)) {
      continue;
    }
    if (e.type === EntityType.WAY) {
      const foundNodes = e.nodes.filter(n => allBaseIds.has(n));
      if (foundNodes.length > 0) {
        // console.log('foundNodes: ', foundNodes, e.id);
        const { log, updatedEntities } = logIntroduceEntity(
          state,
          e,
          foundNodes
        );
        // fix me
        if (updatedEntities.length > 0) {
          mod.set(e.id, e);
          e.nodes.forEach(n => {
            mod.set(n, state.virgin.elements.get(n));
          });
          updatedEntities.forEach(e => mod.set(e.id, e));
          // console.log(log, updatedEntities);
          state = {
            ...state,
            log,
            modified: mod,
          };
          allBaseIds = logGetBaseIds(state.log);
        }
      }
    }
  }
  console.timeEnd('int');

  return state;
}

export function stateAddVirgins(
  state: OsmState,
  entities: Entity[],
  quadkey: string
) {
  // entities = entities.filter(r => r.type !== 'relation');
  consistencyChecker(state);

  // fix this imperative piece of shit
  virginAddElements(entities, quadkey, state.virgin);
  state = stateIntroduceEntities(state, entities);
  consistencyChecker(state);
  return state;
}

export function stateAddModified(
  state: OsmState,
  entities: Entity[]
): OsmState {
  consistencyChecker(state);

  const newState = {
    ...state,
    log: logAddEntry(setCreate(entities.map(r => r.id)))(state.log),
    modified: modifiedAddModifiedEntitiesAndRelated(
      state.modified,
      state.virgin,
      entities
    ),
  };
  consistencyChecker(newState);
  return newState;
}

/**
 * following a very strict way
 * When shredding, shred everything but the bare minimum
 *  to render the modified ids, which is exactly
 *  [nodes, ways, nodesOfWays, relations].
 *  - relations dont get any members as they cannot be rendered
 *  - if a relation member was modified, it will be treated as an individual
 *  and would get the same rules again
 *  - to render ways we need node ids, so modified ways will get all of the nodesOfWays
 *    for eg. if a tag was added, hypothetically we dont even need the nodes, but to
 *     visualize we need the nodes, hence we will also add the nodes.
 *  - all the modified nodes will be kept and everything (including all parents) would
 *     be removed. If a parent did exist, it will get added automatically whenever virgin data comes
 *     if a modified parent exists it will also get added, whenever the modified entities
 *    are applied to state.
 */
export function stateShred(state: OsmState): OsmState {
  consistencyChecker(state);

  const newState = stateCreate(
    undefined,
    new Map(state.modified),
    undefined,
    state.log
  );

  consistencyChecker(newState);
  return newState;
}

export function stateGenNextId(state: OsmState, id: string) {
  return genNextId(state, id);
}
