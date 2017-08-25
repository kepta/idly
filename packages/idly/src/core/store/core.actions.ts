import { actionBuilderFactory } from 'common/actions';

import { Entities, Entity, EntityId } from 'idly-common/lib/osm';
import { ParentWays } from 'osm/parsers/parsers';

export enum CoreActions {
  // initiate a selection call
  // let a saga handle where to get the
  // data from (virgin entities from worker)
  // or if selected from main thread.
  SELECTION_FETCH = 'SELECTION_FETCH',
  SELECTION_COMMIT = 'SELECTION_COMMIT',
  UPDATE = 'CORE.update',
  REMOVE = 'CORE.remove',
  HIDE = 'CORE.hide',
  OTHER_ACTION = '__any_other_action_type_core__'
}

export enum SelectActions {
  SELECT_ENTITIES = 'Selection.SELECT_ENTITIES',
  COMMIT = 'Selection.COMMIT'
}

const selectActionBuilder = actionBuilderFactory<SelectActionType>();
export type SelectActionType = SelectEntitiesAction | SelectCommitAction;

export interface SelectEntitiesAction {
  type: SelectActions.SELECT_ENTITIES;
  entitiesId: EntityId[];
}

export const selectEntitiesAction = selectActionBuilder<SelectEntitiesAction>(
  SelectActions.SELECT_ENTITIES
)('entitiesId');

export interface SelectCommitAction {
  type: SelectActions.COMMIT;
  features: any[];
}

export const selectCommitAction = selectActionBuilder<SelectCommitAction>(
  SelectActions.COMMIT
)('features');
