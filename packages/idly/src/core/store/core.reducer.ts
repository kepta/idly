import { ImMap } from 'idly-common/lib/misc/immutable';
import { FeatureTable } from 'idly-common/lib/osm/feature';
import { Tree } from 'idly-graph/lib/graph/Tree';
import { CoreActions, CoreActionType } from './core.actions';

export type CoreState = Readonly<{
  readonly selectedTree: Tree;
  readonly featureTable: FeatureTable<any, any>;
}>;

const coreState: CoreState = {
  selectedTree: null,
  featureTable: ImMap()
};

export function coreReducer(
  state = coreState,
  action: CoreActionType
): CoreState {
  switch (action.type) {
    case CoreActions.SELECT_COMMIT: {
      const { tree, featureTable } = action;
      // if (state.selectedTree) {
      //   return {
      //     selectedTree: tree,
      //     featureTable
      //   };
      // }
      return { selectedTree: tree, featureTable };
    }
    default: {
      return state;
    }
  }
}
