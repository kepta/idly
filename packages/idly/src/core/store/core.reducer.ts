import { Record, Set } from 'immutable';

import { Node } from 'osm/entities/node';
import { Graph, graphFactory } from 'osm/history/graph';
import { graphSetEntities } from 'osm/history/helpers';

import { Action } from 'common/actions';

import {
  addToModifiedEntities,
  addToVirginEntities,
  Entities,
  removeEntities
} from 'core/coreOperations';
import { CORE } from 'core/store/core.actions';

const initialState = {
  graph: graphFactory(),
  modifedEntities: Set(),
  entities: Set()
};

export class CoreState extends Record(initialState) {
  public graph: Graph;
  public entities: Entities;
  public modifedEntities: Entities;
  public set(k: string, v: any): CoreState {
    return super.set(k, v) as CoreState;
  }
}

const coreState = new CoreState();

export function coreReducer(state = coreState, action: Action<any>) {
  switch (action.type) {
    case CORE.newData: {
      const data: Node[] = action.data;
      return state
        .update('graph', (graph: Graph) => graphSetEntities(graph, data))
        .update('entities', (entities: Entities) =>
          addToVirginEntities(entities, Set(data), state.modifedEntities, true)
        );
    }
    case CORE.addModified: {
      console.time(CORE.addModified);
      const modifiedEntities: Entities = action.modifedEntities;
      const newState = state
        // .set('graph', graph)
        // .update('entities', (entities: Entities) =>
        //   removeEntities(entities, modifiedEntitiesId)
        // )
        .update('modifedEntities', (modifedEntities: Entities) => {
          return addToModifiedEntities(modifedEntities, modifiedEntities);
        });
      console.timeEnd(CORE.addModified);
      return newState;
    }
    case CORE.removeIds: {
      const modifiedEntitiesId: Set<string> = action.modifedEntitiesId;
      if (modifiedEntitiesId.size === 0) return state;
      console.time(CORE.removeIds);
      /**
       * @REVISIT not sure about
       * entities.subtrsct using state.graph.getIn(['node'
       * or the replacement removeEntities(entities, modifiedEntitiesId)
       */
      const newState = state
        .update(
          'entities',
          (entities: Set<Node>) =>
            entities.subtract(
              modifiedEntitiesId.map(m => state.graph.getIn(['node', m]))
            )
          // removeEntities(entities, modifiedEntitiesId)
        )
        .update('modifedEntities', (entities: Set<Node>) =>
          removeEntities(entities, modifiedEntitiesId)
        );
      console.timeEnd(CORE.removeIds);

      return newState;
    }
    default:
      return state;
  }
}
