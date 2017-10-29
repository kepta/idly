import { ImMap } from 'idly-common/lib/misc/immutable';
import { FeatureTable } from 'idly-common/lib/osm/feature';
import { Tree } from 'idly-graph/lib/graph/Tree';
import { CoreActions, CoreActionType } from './core.actions';

export type CoreState = Readonly<{
  readonly selectedTree: Tree;
}>;

const coreState: CoreState = {
  selectedTree: Tree.fromEntities([])
};

export function coreReducer(
  state = coreState,
  action: CoreActionType
): CoreState {
  switch (action.type) {
    case CoreActions.SELECT_COMMIT: {
      const { tree } = action;
      return { selectedTree: state.selectedTree.merge(tree) };
    }
    default: {
      return state;
    }
  }
}
