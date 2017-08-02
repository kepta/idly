import { Feature, Point } from 'geojson';
import { List } from 'immutable';

import { action, Action } from 'common/actions';
import { NodeFeature } from 'map/utils/nodeToFeat';

export const DRAW = {
  selectFeatures: 'DRAW.selectFeatures',
  commit: 'DRAW.commit',
  updateSelection: 'DRAW.updateSelection'
};

type PointFeature = Feature<Point>;

export interface IDrawSelect {
  features: PointFeature[];
}

export type SelectFeaturesAction = Action<{
  featuresToSelect: List<NodeFeature>;
  featuresThatWereSelected: List<NodeFeature>;
}>;

export const selectFeatures = (
  featuresToSelect: List<NodeFeature>,
  featuresThatWereSelected: List<NodeFeature>
): SelectFeaturesAction =>
  action(DRAW.selectFeatures, { featuresToSelect, featuresThatWereSelected });
