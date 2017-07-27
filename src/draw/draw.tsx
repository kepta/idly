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
      // map.on('click', this.handleClick);
      map.on('draw.selectionchange', this.drawSelectionChange);
      this.setState({ loaded: true });
    });
  }
  drawSelectionChange = () => {
    // const selectIds = this.draw.getSelectedIds();
    // const selectedFeature = this.props.selectedFeatures.filter(
    //   feature => selectIds.indexOf(feature.id) === -1
    // );
    // console.log('selection change', selectIds, this.draw.getAll());
    // console.log('props.selectedFeatures', this.props.selectedFeatures.toJS());
    // this.props.commitModified(List(this.draw.getAll().features));
    // this.draw.delete(selectedFeature.map(f => f.id).toArray());
  };
  componentWillUnMount() {
    this.props.dirtyMapAccess(map => {
      if (!map) return;
      map.off('click', this.handleClick);
    });
  }
  shouldComponentUpdate(nextProps: IPropsType) {
    return !this.props.selectedFeatures.equals(nextProps.selectedFeatures);
  }
  dirtyDrawAccess = func => func(this.draw);
  handleClick = (e: any) => {
    this.props.dirtyMapAccess(map => {
      // set bbox as 5px reactangle area around clicked point
      const bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ];
      console.log('point', e.point);
      return;
      /**
       * for blue dots, everything happens
       * but just that draw.getSelectedIds() === phi
       * like it looses the selection
       */
      const featuresToSelect: List<NodeFeature> = List(
        map
          .queryRenderedFeatures(bbox, {
            layers: this.props.layers
          })
          .map(f => ({
            ...f,
            id: f.properties.id,
            geometry: f.geometry
          }))
      );
      const featuresThatWereSelected: List<NodeFeature> = List(
        R.uniqBy((a: any) => a.id, this.draw.getAll().features).map(f => ({
          ...f,
          id: f.properties.id,
          geometry: f.geometry
        }))
      );

      // console.log('handleClick', featuresToSelect);
      // console.log('toSelect feature', featuresToSelect.toJS());
      // console.log(
      //   ' feature that was selected',
      //   featuresThatWereSelected.toJS()
      // );

      console.log('clicker', featuresToSelect, featuresThatWereSelected);
      this.props.selectFeatures(featuresToSelect, featuresThatWereSelected);
      // if (this.draw.getAll().features.length > 0) {
      //   this.props.commitModified(
      //     List(R.uniqBy(a => a.id, this.draw.getAll().features))
      //   );
      // }
      // if (Array.isArray(features) && features.length > 0) {
      //   // this.draw.changeMode('NodeMangler', { features });
      //   this.props.selectFeatures(List([features[0]]));
      // }
    });
  };
  render() {
    if (!this.state.loaded) return null;
    console.log('draw rendering', this.props);
    return (
      <DrawFeatures
        dirtyDrawAccess={this.dirtyDrawAccess}
        selectedFeatures={this.props.selectedFeatures}
        selectFeatures={this.props.selectFeatures}
      />
    );
  }
}

export const Draw = connect<any, any, any>(
  (state: IRootStateType, props) => ({
    selectedFeatures: state.draw.selectedFeatures
  }),
  { selectFeatures }
)(DrawComp);
