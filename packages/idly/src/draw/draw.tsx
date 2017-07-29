import MapboxDraw = require('@mapbox/mapbox-gl-draw');
import { List } from 'immutable';
import * as R from 'ramda';
import * as React from 'react';
import { connect } from 'react-redux';

import { IRootStateType } from 'common/store';
import { featToNode } from 'map/utils/featToNode';
import { NodeFeature } from 'map/utils/nodeToFeat';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';
import { attachToWindow } from 'utils/attach_to_window';

import { DrawFeatures } from 'draw/draw_features';
import { setupDraw } from 'draw/draw_setup';

interface IPropsType {
  map: any;
  selectedFeatures: List<any>;
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
  dirtyDrawAccess = func => func(this.draw);
  render() {
    console.log('draw rendering', this.props);
    return null;
  }
}

export const Draw = connect<any, any, any>((state: IRootStateType, props) => ({
  selectedFeatures: state.draw.selectedFeatures
}))(DrawComp);
