import MapboxDraw = require('@mapbox/mapbox-gl-draw');
import { List } from 'immutable';

import { DrawFeatures } from 'draw/draw_features';
import { setupDraw } from 'draw/draw_setup';
import { featToNode } from 'map/featToNode';
import { NodeFeature } from 'map/nodeToFeat';

import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';
import * as R from 'ramda';
import * as React from 'react';
import { connect } from 'react-redux';
import { selectFeatures } from 'store/draw/draw.actions';
import { IRootStateType } from 'store/index';
import { attachToWindow } from 'utils/attach_to_window';

interface IPropsType {
  map: any;
  selectedFeatures: List<any>;
  selectFeatures: (
    featuresToSelect: List<NodeFeature>,
    featuresThatWereSelected: List<NodeFeature>
  ) => void;
  dirtyMapAccess;
  layers: string[];
}
interface IStatesType {
  loaded: boolean;
}
class DrawComp extends React.PureComponent<IPropsType, IStatesType> {
  state = {
    loaded: false
  };
  private draw;
  constructor(props: IPropsType) {
    super(props);
    this.draw = setupDraw();
    attachToWindow('draw', this.draw);
  }
  componentDidMount() {
    this.props.dirtyMapAccess(map => {
      if (!map) return;
      map.addControl(this.draw);
      this.setState({ loaded: true });
    });
  }
  shouldComponentUpdate(nextProps: IPropsType) {
    return !this.props.selectedFeatures.equals(nextProps.selectedFeatures);
  }
  dirtyDrawAccess = func => func(this.draw);
  render() {
    console.log('draw rendering', this.props);
    return null;
  }
}

export const Draw = connect<any, any, any>(
  (state: IRootStateType, props) => ({
    selectedFeatures: state.draw.selectedFeatures
  }),
  { selectFeatures }
)(DrawComp);
