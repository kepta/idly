import { actionBuilderFactory } from 'common/actions';

import { Entities, EntitiesId, Entity } from 'osm/entities/entities';
import { ParentWays } from 'osm/parsers/parsers';

export enum CoreActions {
  SELECTION_FETCH = 'SELECTION_FETCH',
  SELECTION_GET = '',
  UPDATE = 'CORE.update',
  REMOVE = 'CORE.remove',
  HIDE = 'CORE.hide',
  OTHER_ACTION = '__any_other_action_type_core__'
}

export type CoreActionTypes =
  | ICoreSelectAction
  | ICoreUpdateAction
  | ICoreRemoveAction
  | ICoreHideAction
  | IOtherAction;

const actionBuilder = actionBuilderFactory<CoreActionTypes>();

interface ICoreSelectAction {}

interface ICoreUpdateAction {
  type: CoreActions.UPDATE;
  data: Entity[];
}

interface ICoreRemoveAction {
  type: CoreActions.REMOVE;
  ids: EntitiesId;
}

interface ICoreHideAction {
  type: CoreActions.HIDE;
  ids: EntitiesId;
}

interface IOtherAction {
  type: CoreActions.OTHER_ACTION;
}

export const coreVirginModify = actionBuilder<ICoreVirginModifyAction>(
  CoreActions.VIRGIN_ADD
)('toAdd', 'toRemove', 'parentWays');

export const coreVirginRemove = actionBuilder<ICoreVirginRemoveAction>(
  CoreActions.VIRGIN_REMOVE
)('data');

export const coreModifyAction = actionBuilder<ICoreUpdateAction>(
  CoreActions.UPDATE
)('data');

export const coreRemoveAction = actionBuilder<ICoreRemoveAction>(
  CoreActions.REMOVE
)('ids');

export const coreHideAction = actionBuilder<ICoreHideAction>(CoreActions.HIDE)(
  'ids'
);
