import { List, Record, Set } from 'immutable';

import { Node } from 'osm/entities/node';
import { Graph, graphFactory } from 'osm/history/graph';
import {
  graphRemoveEntitiesWithId,
  graphSetEntities
} from 'osm/history/helpers';

import { Action } from 'common/actions';

import { Entities, EntitiesId, Entity } from 'osm/entities/entities';
import { getGeometry } from 'osm/entities/helpers/misc';
import { AreaKeys, initAreaKeys } from 'osm/presets/areaKeys';
import { initPresets } from 'osm/presets/presets';

import {
  addToModifiedEntities,
  addToVirginEntities,
  calculateParentWays,
  removeEntities
} from 'core/coreOperations';
import { CoreActions, CoreActionTypes } from 'core/store/core.actions';
import { ParentWays } from 'osm/parsers/parsers';

const initialState = {
  graph: graphFactory(),
  modifiedEntities: Set(),
  entities: Set(),
  presets: initPresets(),
  parentWays: new Map(),
  queueToEvict: List(),
  selectedEntities: Set(),
  areaKeys: null
};

initialState.areaKeys = initAreaKeys(initialState.presets.all);

export class CoreState extends Record(initialState) {
  public graph: Graph;
  public entities: Entities;
  public modifiedEntities: Entities;
  public selectedEntities: Entities;
  public areaKeys: AreaKeys;
  public parentWays: ParentWays;
  public queueToEvict: List<Entity[]>;
  public set(k: string, v: any): CoreState {
    return super.set(k, v) as CoreState;
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
      const { data, parentWays, type } = action;
      console.time(type);
      const entities = state.entities;
      const newState = state
        .update('graph', (graph: Graph) => graphSetEntities(graph, data))
        /**
         * @TOFIX the Map and Im.Map are damn confusing.
         */
        .set('parentWays', parentWays)
        .set(
          'entities',
          addToVirginEntities(entities, Set(data), state.modifiedEntities, true)
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

// function foo() {
//   switch (action.type) {
//     case CORE.newData: {
//       console.time(CORE.newData);
//       const data: Entity[] = action.data;
//       let queueToEvict = state.queueToEvict;

//       const entities = state.entities;
//       if (queueToEvict.size > LIMIT) {
//         console.log('evicting');
//         // entities = entities
//         //   .clear()
//         //   .union(queueToEvict.last())
//         //   .union(queueToEvict.get(-2));
//         queueToEvict = queueToEvict.clear();
//       }
//       queueToEvict = queueToEvict.push(data);
//       const newState = state
//         .update('graph', (graph: Graph) => graphSetEntities(graph, data))
//         .set(
//           'entities',
//           addToVirginEntities(
//             entities,
//             Set(data),
//             state.modifiedEntities,
//             false
//           )
//         )
//         .set('queueToEvict', queueToEvict);
//       console.timeEnd(CORE.newData);
//       return newState;
//     }
//     case CORE.addModified: {
//       console.time(CORE.addModified);
//       const modifiedEntities: Entities = action.modifiedEntities;
//       const newState = state
//         .update('modifiedGraph', (modifiedGraph: Graph) =>
//           graphSetEntities(modifiedGraph, modifiedEntities.toArray())
//         )
//         .update('modifiedEntities', (mEn: Entities) => {
//           return addToModifiedEntities(mEn, modifiedEntities);
//         });
//       console.timeEnd(CORE.addModified);
//       return newState;
//     }
//     case CORE.removeIds: {
//       const modifiedEntitiesId: EntitiesId = action.modifiedEntitiesId;
//       if (modifiedEntitiesId.size === 0) return state;
//       /**
//        * @REVISIT not sure about
//        * entities.subtract using state.graph.getIn(['node'
//        * or the replacement removeEntities(entities, modifiedEntitiesId)
//        */
//       console.time(CORE.removeIds);
//       const newState = state
//         .update(
//           'entities',
//           (entities: Entities) =>
//             entities.subtract(
//               modifiedEntitiesId.map(m => {
//                 /**
//                  * @REVISIT this is so hacky man
//                  *  you check this shit :(
//                  */
//                 if (m[0] === 'n') return state.graph.getIn(['node', m]);
//                 if (m[0] === 'w') return state.graph.getIn(['way', m]);
//                 if (m[0] === 'r') return state.graph.getIn(['relation', m]);
//               })
//             )
//           // removeEntities(entities, modifiedEntitiesId)
//         )
//         .update(
//           'graph',
//           (graph: Graph) =>
//             graphRemoveEntitiesWithId(graph, modifiedEntitiesId.toArray())
//           // removeEntities(entities, modifiedEntitiesId)
//         )
//         .update('modifiedEntities', (entities: Entities) =>
//           removeEntities(entities, modifiedEntitiesId)
//         );

//       console.timeEnd(CORE.removeIds);
//       return newState;
//     }
//     default:
//       return state;
//   }
// }
