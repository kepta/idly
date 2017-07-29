import { List, Map, Record, Set } from 'immutable';
import { uniqWith } from 'ramda';

import { Action } from 'common/actions';
import { OSM_TILES } from 'map/store/map.actions';
import { Entities } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';
import { Graph, graphFactory } from 'osm/history/graph';
import { graphRemoveEntities, graphSetEntities } from 'osm/history/helpers';

import { DRAW } from 'draw/store/draw.actions';

const initialState = {
  selectedFeatures: List()
};

export class DrawState extends Record(initialState) {
  public selectedFeatures: List<Node>;
  public set(k: string, v: any): DrawState {
    return super.set(k, v) as DrawState;
  }
}
const drawState = new DrawState();

export function drawReducer(state = drawState, action: Action<any>) {
  switch (action.type) {
    case DRAW.updateSelection: {
      return state.set('selectedFeatures', action.selectedFeatures);
    }
    default:
      return state;
  }
}
