import { actionBuilderFactory } from 'common/actions';

import { Entity, EntityId } from 'idly-common/lib/osm';
import { Feature } from 'idly-common/lib/osm/feature';

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
  entities: Entity[];
  features: Array<Feature<any, any>>;
}

export const selectCommitAction = selectActionBuilder<SelectCommitAction>(
  SelectActions.COMMIT
)('features', 'entities');
