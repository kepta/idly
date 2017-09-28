import { List } from 'immutable';

import * as React from 'react';
import { connect } from 'react-redux';

import { IRootStateType } from 'common/store';
import { attachToWindow } from 'utils/attach_to_window';

import { setupDraw } from 'draw/draw_setup';
interface IPropsType {
  map: any;
  selectedFeatures: List<any>;
  dirtyMapAccess;
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
