import { List } from 'immutable';

import { Feature, Point } from 'geojson';
import { LngLatBounds } from 'mapbox-gl';
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
export interface ICommitModified {
  features: List<any>;
}

export const selectFeatures = features =>
  action(DRAW.selectFeatures, { features });

export const commitModified = (features: List<any>): ICommitModified =>
  action(DRAW.commit, { features });
