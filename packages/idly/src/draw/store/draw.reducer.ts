import { List, Record } from 'immutable';

import { Action } from 'common/actions';
import { Node } from 'osm/entities/node';

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
