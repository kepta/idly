
import { actionBuilderFactory } from 'common/actions';

import { EntitiesId, Entity } from 'osm/entities/entities';
import { ParentWays } from 'osm/parsers/parsers';

export enum CoreActions {
  VIRGIN_ADD = 'CORE.virgin_add',
  VIRGIN_REMOVE = 'CORE.virgin_remove',
  UPDATE = 'CORE.update',
  REMOVE = 'CORE.remove',
  HIDE = 'CORE.hide',
  OTHER_ACTION = '__any_other_action_type_core__'
}

export type CoreActionTypes =
  | ICoreVirginAddAction
  | ICoreVirginRemoveAction
  | ICoreUpdateAction
  | ICoreRemoveAction
  | ICoreHideAction
  | IOtherAction;

const actionBuilder = actionBuilderFactory<CoreActionTypes>();

interface ICoreVirginAddAction {
  type: CoreActions.VIRGIN_ADD;
  data: Entity[];
  parentWays: ParentWays;
}

interface ICoreVirginRemoveAction {
  type: CoreActions.VIRGIN_REMOVE;
  data: Entity[];
}

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

export const coreVirginAdd = actionBuilder<ICoreVirginAddAction>(
  CoreActions.VIRGIN_ADD
)('data', 'parentWays');

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
