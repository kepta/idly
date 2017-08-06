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
import { CORE } from 'core/store/core.actions';
import { ParentWays } from 'osm/parsers/parsers';

const initialState = {
  graph: graphFactory(),
  modifiedGraph: graphFactory(),
  modifiedEntities: Set(),
  entities: Set(),
  presets: initPresets(),
  parentWays: new Map(),
  queueToEvict: List(),
  areaKeys: null
};
initialState.areaKeys = initAreaKeys(initialState.presets.all);

export class CoreState extends Record(initialState) {
  public graph: Graph;
  public entities: Entities;
  public modifiedEntities: Entities;
  public modifiedGraph: Graph;
  public areaKeys: AreaKeys;
  public parentWays: ParentWays;
  public queueToEvict: List<Entity[]>;
  public set(k: string, v: any): CoreState {
    return super.set(k, v) as CoreState;
  }
}

const coreState = new CoreState();
const LIMIT = 8;
export function coreReducer(state = coreState, action: Action<any>) {
  switch (action.type) {
    case CORE.newData: {
      console.time(CORE.newData);
      const data: Entity[] = action.data;
      let queueToEvict = state.queueToEvict;

      const entities = state.entities;
      if (queueToEvict.size > LIMIT) {
        console.log('evicting');
        // entities = entities
        //   .clear()
        //   .union(queueToEvict.last())
        //   .union(queueToEvict.get(-2));
        queueToEvict = queueToEvict.clear();
      }
      queueToEvict = queueToEvict.push(data);
      const newState = state
        .update('graph', (graph: Graph) => graphSetEntities(graph, data))
        .set(
          'entities',
          addToVirginEntities(
            entities,
            Set(data),
            state.modifiedEntities,
            false
          )
        )
        .set('queueToEvict', queueToEvict);
      console.timeEnd(CORE.newData);
      return newState;
    }
    case CORE.addModified: {
      console.time(CORE.addModified);
      const modifiedEntities: Entities = action.modifiedEntities;
      const newState = state
        .update('modifiedGraph', (modifiedGraph: Graph) =>
          graphSetEntities(modifiedGraph, modifiedEntities.toArray())
        )
        .update('modifiedEntities', (mEn: Entities) => {
          return addToModifiedEntities(mEn, modifiedEntities);
        });
      console.timeEnd(CORE.addModified);
      return newState;
    }
    case CORE.removeIds: {
      const modifiedEntitiesId: EntitiesId = action.modifiedEntitiesId;
      if (modifiedEntitiesId.size === 0) return state;
      /**
       * @REVISIT not sure about
       * entities.subtract using state.graph.getIn(['node'
       * or the replacement removeEntities(entities, modifiedEntitiesId)
       */
      console.time(CORE.removeIds);
      const newState = state
        .update(
          'entities',
          (entities: Entities) =>
            entities.subtract(
              modifiedEntitiesId.map(m => {
                /**
                 * @REVISIT this is so hacky man
                 *  you check this shit :(
                 */
                if (m[0] === 'n') return state.graph.getIn(['node', m]);
                if (m[0] === 'w') return state.graph.getIn(['way', m]);
                if (m[0] === 'r') return state.graph.getIn(['relation', m]);
              })
            )
          // removeEntities(entities, modifiedEntitiesId)
        )
        .update(
          'graph',
          (graph: Graph) =>
            graphRemoveEntitiesWithId(graph, modifiedEntitiesId.toArray())
          // removeEntities(entities, modifiedEntitiesId)
        )
        .update('modifiedEntities', (entities: Entities) =>
          removeEntities(entities, modifiedEntitiesId)
        );

      console.timeEnd(CORE.removeIds);
      return newState;
    }
    default:
      return state;
  }
}
