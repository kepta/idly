import { actionBuilderFactory } from 'common/actions';

import { Feature, FeatureTable } from 'idly-common/lib/osm/feature';
import { Entity, EntityId, EntityTable } from 'idly-common/lib/osm/structures';
import { Tree } from 'idly-graph/lib/graph/Tree';

export enum SelectActions {
  SELECT_ENTITIES = 'Selection.SELECT_ENTITIES',
  COMMIT = 'Selection.COMMIT'
}

const selectActionBuilder = actionBuilderFactory<SelectActionType>();

export type SelectActionType = SelectEntitiesAction | SelectCommitAction;

export interface SelectEntitiesAction {
  type: SelectActions.SELECT_ENTITIES;
  entityIds: EntityId[];
}

export const selectEntitiesAction = selectActionBuilder<SelectEntitiesAction>(
  SelectActions.SELECT_ENTITIES
)('entityIds');

export interface SelectCommitAction {
  type: SelectActions.COMMIT;
  tree: Tree;
  featureTable: FeatureTable<any, any>;
}

export const selectCommitAction = selectActionBuilder<SelectCommitAction>(
  SelectActions.COMMIT
)('tree', 'featureTable');
