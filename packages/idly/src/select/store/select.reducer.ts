import { ImMap } from 'idly-common/lib/misc/immutable';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Feature, FeatureTable } from 'idly-common/lib/osm/feature';
import { featureTableGen } from 'idly-common/lib/osm/featureTableGen';
import {
  Entities,
  Entity,
  EntityId,
  EntityTable
} from 'idly-common/lib/osm/structures';
import { Tree } from 'idly-graph/lib/graph/Tree';
import { SelectActions, SelectActionType } from './select.actions';

export type SelectState = Readonly<{
  readonly tree: Tree;
  readonly featureTable: FeatureTable<any, any>;
}>;
// const featureTable: FeatureTable<any, any> = ImMap();

const selectState: SelectState = {
  tree: null,
  featureTable: ImMap()
};

export function selectReducer(
  state = selectState,
  action: SelectActionType
): SelectState {
  switch (action.type) {
    case SelectActions.COMMIT: {
      const { tree, featureTable } = action;
      return { tree, featureTable };
    }
    default: {
      return state;
    }
  }
}
