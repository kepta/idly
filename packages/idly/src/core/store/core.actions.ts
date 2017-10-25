import { actionBuilderFactory } from 'common/actions';

import { FeatureTable } from 'idly-common/lib/osm/feature';
import { EntityId } from 'idly-common/lib/osm/structures';
import { Tree } from 'idly-graph/lib/graph/Tree';

export enum CoreActions {
  SELECT_ENTITIES = 'Core.SELECT_ENTITIES',
  SELECT_COMMIT = 'Core.SELECT_COMMIT',
  SELECT_MODIFY = 'Core.SELECT_MODIFY'
}

const builder = actionBuilderFactory<CoreActionType>();

export type CoreActionType =
  | SelectEntitiesAction
  | SelectCommitAction
  | SelectModifyAction;

/**
 * initiates the async selection of entities
 *  pulls in data from worker thread.
 */
export interface SelectEntitiesAction {
  type: CoreActions.SELECT_ENTITIES;
  entityIds: EntityId[];
}
export const selectEntitiesAction = builder<SelectEntitiesAction>(
  CoreActions.SELECT_ENTITIES
)('entityIds');

/**
 * finalizes the selection of entities and
 *  saves them in the redux store
 */
export interface SelectCommitAction {
  type: CoreActions.SELECT_COMMIT;
  tree: Tree;
  featureTable: FeatureTable<any, any>;
}
export const selectCommitAction = builder<SelectCommitAction>(
  CoreActions.SELECT_COMMIT
)('tree', 'featureTable');

/**
 * modifies the current selection
 */
export interface SelectModifyAction {
  type: CoreActions.SELECT_MODIFY;
  tree: Tree;
}

export const selectModifyAction = builder<SelectModifyAction>(
  CoreActions.SELECT_MODIFY
)('tree');
