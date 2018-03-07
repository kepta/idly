import { Entity } from 'idly-common/lib/osm/structures';
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
import { modifiedAddModifiedEntitiesAndRelated } from './state/modified';
import { DerivedTable, derivedTableUpdate } from './state/derivedTable/index';
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

export function stateAddVirgins(
  state: OsmState,
  entities: Entity[],
  quadkey: string
) {
  // entities = entities.filter(r => r.type !== 'relation');
  consistencyChecker(state);
  // fix this imperative piece of shit
  virginAddElements(entities, quadkey, state.virgin);
  return state;
}

export function stateAddChanged(state: OsmState, entities: Entity[]): OsmState {
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
