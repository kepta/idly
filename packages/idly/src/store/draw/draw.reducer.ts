import { Map, Record, Set } from 'immutable';
import { uniqWith } from 'ramda';

import { Entities } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

import { Graph, graphFactory } from 'osm/history/graph';
import { graphRemoveEntities, graphSetEntities } from 'osm/history/helpers';

import { Action } from 'store/actions';
import { DRAW } from 'store/draw/draw.actions';
import { OSM_TILES } from 'store/map/actions';

const initialState = {
  selectedFeatures: []
};

export class DrawState extends Record(initialState) {
  public selectedFeatures: any[];
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
