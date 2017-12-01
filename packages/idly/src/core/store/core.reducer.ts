import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { FeatureTable } from 'idly-common/lib/osm/feature';
import { Shrub } from 'idly-graph/lib/graph/Shrub';
import { Map as ImMap } from 'immutable';
import { CoreActions, CoreActionType } from './core.actions';

export type CoreState = Readonly<{
  readonly selectedShrub: Shrub;
}>;

const coreState: CoreState = {
  selectedShrub: Shrub.create([], entityTableGen())
};

export function coreReducer(
  state = coreState,
  action: CoreActionType
): CoreState {
  switch (action.type) {
    case CoreActions.SELECT_COMMIT: {
      const { shrub } = action;
      return { selectedShrub: shrub };
    }
    default: {
      return state;
    }
  }
}
