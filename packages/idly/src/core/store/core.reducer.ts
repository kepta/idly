import { Map, Record, Set } from 'immutable';

import { Graph, graphFactory } from 'osm/history/graph';
import { graphSetEntities, graphSetEntitiesSet } from 'osm/history/helpers';

import { Entities, Entity } from 'osm/entities/entities';

import {
  addToModifiedEntities,
  addToVirginEntities,
  removeEntities
} from 'core/coreOperations';
import { CoreActions, CoreActionTypes } from 'core/store/core.actions';
import { ParentWays } from 'osm/parsers/parsers';
interface IInitialState {
  graph: Graph;
  entities: Entities;
  modifiedEntities: Entities;
  parentWays: ParentWays;
}
const initialState = {
  graph: graphFactory(),
  entities: Set(),
  modifiedEntities: Set(),
  parentWays: Map()
};

// initialState.areaKeys = initAreaKeys(initialState.presets.all);

export class CoreState extends (Record(initialState) as any) {
  public graph: Graph;
  public entities: Entities;
  public modifiedEntities: Entities;
  public parentWays: ParentWays;
  public set(k: keyof IInitialState, v: any): CoreState {
    return super.set(k, v);
  }
  public update(k: keyof IInitialState, v: any): CoreState {
    return super.update(k, v);
  }
}

const coreState = new CoreState();
const LIMIT = 8;

export function coreReducer(state = coreState, action: CoreActionTypes) {
  switch (action.type) {
    /**
     * network data pure and untouched.
     * @NOTE need to make sure we dont add entities
     *  which are in the modifiedEntities.
     */
    case CoreActions.VIRGIN_ADD: {
      const { toAdd, parentWays, type, toRemove } = action;
      console.time(type);
      const entities = state.entities;
      const newState = state
        .update('graph', (graph: Graph) => graphSetEntitiesSet(graph, toAdd))
        /**
         * @TOFIX the Map and Im.Map are damn confusing.
         */
        .set('parentWays', parentWays)
        .set(
          'entities',
          addToVirginEntities(
            entities.subtract(toRemove),
            toAdd,
            state.modifiedEntities,
            true
          )
        );
      console.timeEnd(type);
      return newState;
    }
    /**
     * To be only used with network
     */
    case CoreActions.VIRGIN_REMOVE: {
      const { data, type } = action;
      console.time(type);
      const entities = state.entities;
      const newState = state.set('entities', entities.subtract(data));
      console.timeEnd(type);
      return newState;
    }
    /**
     * only for human/ draw / plugin
     */
    case CoreActions.UPDATE: {
      const { data, type } = action;
      console.time(type);
      /**
       * @NOTE this would give out any entity that might be virgin and
       *  got updated.
       * @TOFIX assumption: if a node is already in the modifiedEntities
       *  it wouldnt be in virginEntities, hence we can skip adding them
       *  to virginEntitiesToDelete.
       */
      const virginEntitiesToDelete = data
        .map(m => state.graph.getIn([m.type, m.id]) as Entity)
        .filter(m => m);
      const newState = state
        /**
         * @NOTE so why am I doing entities.subtract instead of
         *  removeEntities, which removes on the basis of id.
         *  I guess the ones we need to take out from `entities`
         *  will always be pure, and the subtract can just simply remove
         *  remove by reference. This assumption can go wrong, I haven't
         *  thought about the edge cases, but yea, The idea is
         *  entities is a pure one and should handle it well.
         * @REVISIT can in future.
         */
        .update('entities', (entities: Entities) =>
          entities.subtract(virginEntitiesToDelete)
        )
        .update('graph', (graph: Graph) => graphSetEntities(graph, data))
        .update('modifiedEntities', modifiedEntities =>
          addToModifiedEntities(modifiedEntities, Set(data))
        );
      console.timeEnd(type);
      return newState;
    }
    /**
     * @TOFIX
     */
    case CoreActions.REMOVE: {
      return state;
    }
    case CoreActions.HIDE: {
      const { ids, type } = action;
      console.time(type);
      /**
       * @NOTE this would give out any entity that might be virgin and
       *  got updated.
       * @TOFIX assumption: if a node is already in the modifiedEntities
       *  it wouldnt be in virginEntities, hence we can skip adding them
       *  to virginEntitiesToDelete.
       */
      const virginEntitiesToDelete = ids
        .map(m => {
          /**
           * @REVISIT this is so hacky man
           *  you check this shit :(
           */
          if (m[0] === 'n') return state.graph.getIn(['node', m]);
          if (m[0] === 'w') return state.graph.getIn(['way', m]);
          if (m[0] === 'r') return state.graph.getIn(['relation', m]);
        })
        .filter(m => m);

      const newState = state
        .update('entities', entities =>
          entities.subtract(virginEntitiesToDelete)
        )
        .update('modifiedEntities', (entities: Entities) =>
          removeEntities(entities, ids)
        );
      console.timeEnd(type);
      return newState;
    }
    default:
      return state;
  }
}
