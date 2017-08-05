import { Record, Set } from 'immutable';

import { Node } from 'osm/entities/node';
import { Graph, graphFactory } from 'osm/history/graph';
import {
  graphRemoveEntitiesWithId,
  graphSetEntities
} from 'osm/history/helpers';

import { Action } from 'common/actions';

import { Entities, EntitiesId, Entity } from 'osm/entities/entities';
import { getGeometry } from 'osm/entities/helpers/misc';
import { initAreaKeys } from 'osm/presets/areaKeys';
import { initPresets } from 'osm/presets/presets';

import {
  addToModifiedEntities,
  addToVirginEntities,
  calculateParentWays,
  removeEntities
} from 'core/coreOperations';
import { CORE } from 'core/store/core.actions';

const initialState = {
  graph: graphFactory(),
  modifiedGraph: graphFactory(),
  modifiedEntities: Set(),
  entities: Set()
  // parentWays: Map()
};

export class CoreState extends Record(initialState) {
  public graph: Graph;
  public entities: Entities;
  public modifiedEntities: Entities;
  public modifiedGraph: Graph;

  // public parentWays: Map<string, Set<string>>;
  public set(k: string, v: any): CoreState {
    return super.set(k, v) as CoreState;
  }
}

const coreState = new CoreState();
const { all, defaults, index, recent } = initPresets();
const areaKeys = initAreaKeys(all);

export function coreReducer(state = coreState, action: Action<any>) {
  switch (action.type) {
    case CORE.newData: {
      console.time(CORE.newData);
      let data: Entity[] = action.data;
      const parentWays = calculateParentWays(data);
      data = data.map(e => {
        return e.set(
          'geometry',
          getGeometry(e, areaKeys, parentWays)
        ) as Entity;
      });
      const newState = state
        .update('graph', (graph: Graph) => graphSetEntities(graph, data))
        .update('entities', (entities: Entities) =>
          addToVirginEntities(entities, Set(data), state.modifiedEntities, true)
        );
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
              modifiedEntitiesId.map(m => state.graph.getIn(['node', m]))
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
