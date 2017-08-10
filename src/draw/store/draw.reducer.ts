import { Record, Set } from 'immutable';

import { Action } from 'common/actions';

import { DrawActions } from 'draw/store/draw.actions';
import { Entities } from 'osm/entities/entities';

const initialState = {
  selected: Set()
};

export class DrawState extends Record(initialState) {
  public selected: Entities;
  public set(k: string, v: any): DrawState {
    return super.set(k, v) as DrawState;
  }
}
const drawState = new DrawState();

export function drawReducer(state = drawState, action: Action<any>) {
  switch (action.type) {
    case DrawActions.APPEND_SELECT: {
      return state.update('selected', selected =>
        selected.union(action.selected)
      );
    }
    case DrawActions.CLEAR_SELECT: {
      return state.update('selected', selected => selected.clear());
    }
    default:
      return state;
  }
}
