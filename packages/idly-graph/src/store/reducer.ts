import { EntityId } from 'idly-common/lib/osm/structures';

import { Tree } from '../graph/Tree';
import { CoreActionsEnum, CoreActionTypes } from './actions';

export type CoreState = Readonly<{
  readonly tree: Tree;
  readonly selectedIds: EntityId[];
}>;

const coreState: CoreState = {
  selectedIds: [],
  tree: Tree.fromEntities([]),
};

export function coreReducer(
  state = coreState,
  action: CoreActionTypes,
): CoreState {
  switch (action.type) {
    case CoreActionsEnum.ReplaceState: {
      const { tree, selectedIds } = action;
      return { tree, selectedIds };
    }
    default: {
      return state;
    }
  }
}
