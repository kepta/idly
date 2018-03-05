import { Entity } from 'idly-common/lib/osm/structures';
import { Identity } from 'monet';
import { genNextId } from './stateHelpers/genNextId';
import { setAddIterable, setBulkDelete, setClone, setCreate } from './helper';
import { logAddEntry, logCreate, logGetBaseIds, logGetCurrentIds } from './log';
import {
  changedTableAddModifiedEntities,
  changedTableGetEntity,
} from './osmState';
import { DerivedTable, derivedTableUpdate } from './osmState/derivedTable';
import {
  addVirginElements,
  virginGetInQuadkeys,
  VirginState,
  virginStateCreate,
} from './state/state';
import { getEntitiesAndRelated } from './stateHelpers';
import { OsmState } from './type';

export function stateCreate(
  virgin: VirginState<Entity> = virginStateCreate(),
  changedTable = new Map(),
  derivedTable = new Map(),
  log = logCreate()
): OsmState {
  return {
    changedTable,
    derivedTable,
    log,
    virgin,
  };
}

export function stateGetEntity(
  state: OsmState,
  id: string
): Entity | undefined {
  return (
    changedTableGetEntity(state.changedTable, state.log, id) ||
    state.virgin.elements.get(id)
  );
}

export function stateGetVisibles(
  state: OsmState,
  quadkeys: string[]
): DerivedTable {
  return Identity(
    setClone(virginGetInQuadkeys(state.virgin.quadkeysTable, quadkeys))
  )
    .map(visibleIds => setBulkDelete(logGetBaseIds(state.log), visibleIds))
    .map(visibleIds => setAddIterable(logGetCurrentIds(state.log), visibleIds))
    .map(visibleIds =>
      getEntitiesAndRelated(
        visibleIds,
        state.changedTable,
        state.virgin.elements
      )
    )
    .map(entityTable => derivedTableUpdate(entityTable, state.derivedTable))
    .get();
}

export function stateAddVirgins(
  state: OsmState,
  entities: Entity[],
  quadkey: string
) {
  // fix this imperative piece of shit
  addVirginElements(entities, quadkey, state.virgin);
  return state;
}

export function stateAddChanged(state: OsmState, entities: Entity[]): OsmState {
  return {
    ...state,
    changedTable: changedTableAddModifiedEntities(
      state.changedTable,
      state.virgin,
      entities
    ),
    log: logAddEntry(setCreate(entities.map(r => r.id)))(state.log),
  };
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
  return stateCreate(
    undefined,
    new Map(state.changedTable),
    undefined,
    state.log
  );
}

export function stateGenNextId(state: OsmState, id: string) {
  return genNextId(id, state);
}
