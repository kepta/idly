import { Record, Set } from 'immutable';
import { SelectActions } from '../../core/store/core.actions';

import { Action } from 'common/actions';

import { DrawActions } from 'draw/store/draw.actions';
import { Entity } from 'idly-common/lib';

const initialState = {
  selected: Set()
};

export class DrawState extends Record(initialState) {
  public selected: Set<Entity>;
  public set(k: string, v: any): DrawState {
    return super.set(k, v) as DrawState;
  }
}
const drawState = new DrawState();

export function drawReducer(state = drawState, action: Action<any>) {
  switch (action.type) {
    case SelectActions.COMMIT: {
      return state.update('selected', selected => Set(action.features));
      // return state.update('selected', selected =>
      //   selected.union(action.selected)
      // );
    }
    case DrawActions.CLEAR_SELECT: {
      return state.update('selected', selected => selected.clear());
    }
    default:
      return state;
  }
}
