import { Map, Record, Set } from 'immutable';
import { uniqWith } from 'ramda';

import { Entities } from 'osm/entities/entities';
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
      return state
        .update('graph', (graph: Graph) => graphSetEntities(graph, action.data))
        .update('entities', (entities: Entities) =>
          entities.union(action.data)
        );
    }
    case CORE.removeIds: {
      const selectedEntities: Array<
        Node | Way | Relation
      > = action.ids.map(id => state.graph.getIn([getTypeFromID(id), id]));
      return (
        state
          // .update('graph', (graph: Graph) => graphRemoveEntities(graph, selectedEntities))
          .update('entities', (entities: Entities) =>
            entities.subtract(selectedEntities)
          )
      );
    }
    default:
      return state;
  }
}
