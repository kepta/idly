
import { actionBuilderFactory } from 'common/actions';

import { EntitiesId } from 'osm/entities/entities';

export enum DrawActions {
  SELECT = 'Draw.SELECT',
  UPDATE = 'Draw.UPDATE',
  APPEND_SELECT = 'Draw.APPEND_SELECT',
  CLEAR_SELECT = 'Draw.CLEAR_SELECT',
  IOtherAction = '__any_other_action_type_draw__'
}

export type DrawActionTypes = IDrawSelect | IDrawClear;
const actionBuilder = actionBuilderFactory<DrawActionTypes>();

export interface IDrawSelect {
  type: DrawActions.SELECT;
  ids: EntitiesId;
}
export interface IDrawClear {
  type: DrawActions.CLEAR_SELECT;
}
export const drawSelectAction = actionBuilder<IDrawSelect>(DrawActions.SELECT)(
  'ids'
);

export const drawClearAction = actionBuilder<IDrawClear>(
  DrawActions.CLEAR_SELECT
)();

// export type SelectFeaturesAction = Action<{

//   featuresToSelect: List<string>;
//   featuresThatWereSelected: List<NodeFeature>;
// }>;

// export const selectFeatures = (
//   featuresToSelect: List<string>,
//   featuresThatWereSelected: List<NodeFeature>
// ): SelectFeaturesAction =>
//   action(DRAW.selectFeatures, { featuresToSelect, featuresThatWereSelected });
