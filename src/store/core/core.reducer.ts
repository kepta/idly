import { List, Map, Record, Set } from 'immutable';
import { uniqWith } from 'ramda';

import {
  addToModifiedEntities,
  addToVirginEntities,
  Entities,
  EntitiesId,
  removeEntities
} from 'new/coreOperations';

import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

import { Graph, graphFactory } from 'osm/history/graph';
import { graphRemoveEntities, graphSetEntities } from 'osm/history/helpers';

import { getTypeFromID } from 'osm/misc';
import { Action } from 'store/actions';
import { CORE } from 'store/core/core.actions';

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
      const modifiedEntities: Entities = action.modifedEntities;
      return (
        state
          // .set('graph', graph)
          // .update('entities', (entities: Entities) =>
          //   removeEntities(entities, modifiedEntitiesId)
          // )
          .update('modifedEntities', (modifedEntities: Entities) => {
            return addToModifiedEntities(modifedEntities, modifiedEntities);
          })
      );
    }
    case CORE.removeIds: {
      const modifiedEntitiesId: Set<string> = action.modifedEntitiesId;
      if (modifiedEntitiesId.size === 0) return state;
      return state
        .update('entities', (entities: Set<Node>) =>
          removeEntities(entities, modifiedEntitiesId)
        )
        .update('modifedEntities', (entities: Set<Node>) =>
          removeEntities(entities, modifiedEntitiesId)
        );
    }
    default:
      return state;
  }
}
