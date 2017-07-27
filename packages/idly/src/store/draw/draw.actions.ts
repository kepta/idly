import { List } from 'immutable';

import { Feature, Point } from 'geojson';
import { LngLatBounds } from 'mapbox-gl';
import { Node } from 'osm/entities/node';

import { NodeFeature } from 'map/nodeToFeat';
import { action, Action } from 'store/actions';

export const DRAW = {
  // initiates the removal of selected nodes
  // from the graph.
  selectFeatures: 'DRAW.selectFeatures',
  commit: 'DRAW.commit',
  updateSelection: 'DRAW.updateSelection'
};

type PointFeature = Feature<Point>;
export interface IDrawSelect {
  features: PointFeature[];
}
export type CommitFeaturesAction = Action<{
  features: List<NodeFeature>;
}>;

export type SelectFeaturesAction = Action<{
  featuresToSelect: List<NodeFeature>;
  featuresThatWereSelected: List<NodeFeature>;
}>;

export const selectFeatures = (
  featuresToSelect: List<NodeFeature>,
  featuresThatWereSelected: List<NodeFeature>
): SelectFeaturesAction =>
  action(DRAW.selectFeatures, { featuresToSelect, featuresThatWereSelected });

// export const commitModified = (
//   features: List<NodeFeature>
// ): CommitFeaturesAction => action(DRAW.commit, { features });
