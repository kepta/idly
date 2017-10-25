import { ImMap } from 'idly-common/lib/misc/immutable';
import { FeatureTable } from 'idly-common/lib/osm/feature';
import { Tree } from 'idly-graph/lib/graph/Tree';
import { CoreActions, CoreActionType } from './core.actions';

export type CoreState = Readonly<{
  readonly selectedTree: Tree;
  readonly featureTable: FeatureTable<any, any>;
}>;

const coreState: CoreState = {
  selectedTree: Tree.fromEntities([]),
  featureTable: ImMap()
};

export function coreReducer(
  state = coreState,
  action: CoreActionType
): CoreState {
  switch (action.type) {
    case CoreActions.SELECT_COMMIT: {
      const { tree, featureTable } = action;
      return { selectedTree: tree, featureTable };
    }
    case CoreActions.SELECT_MODIFY: {
      const { tree } = action;
      return { ...state, selectedTree: tree };
    }
    default: {
      return state;
    }
  }
}
