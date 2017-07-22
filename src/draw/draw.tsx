import MapboxDraw = require('@mapbox/mapbox-gl-draw');
import { setupDraw } from 'draw/draw_setup';
import * as React from 'react';
import { connect } from 'react-redux';
import { selectFeatures } from 'store/draw/draw.actions';
import { IRootStateType } from 'store/index';
import { attachToWindow } from 'utils/attach_to_window';

interface IPropsType {
  map: any;
  selectedFeatures: any;
  selectFeatures: (features) => void;
  dirtyMapAccess;
}
class DrawComp extends React.PureComponent<IPropsType, {}> {
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
      map.on('click', this.handleClick);
      map.on('draw.selectionchange', this.drawSelectionChange);
    });
  }
  drawSelectionChange = () => {
    console.log('hiii');
  };
  componentWillUnMount() {
    this.props.dirtyMapAccess(map => {
      if (!map) return;
      map.off('click', this.handleClick);
    });
  }
  componentWillReceiveProps(nextProps: IPropsType) {
    this.renderSelectedFeature(nextProps.selectedFeatures);
  }
  renderSelectedFeature = features => {
    console.log(features);
    if (this.draw && Array.isArray(features) && features.length > 0) {
      const f = features[0];
      f.id = 'x' + f.id;
      f.properties.id = f.id;
      this.draw.add(f);

      this.draw.changeMode(`simple_select`, {
        featureIds: [f.id]
      });
    }
  };
  handleClick = (e: any) => {
    this.props.dirtyMapAccess(map => {
      // set bbox as 5px reactangle area around clicked point
      const bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ];
      const features = map.queryRenderedFeatures(bbox, {
        layers: ['park-volcanoes']
      });
      console.log(features);
      if (Array.isArray(features) && features.length > 0) {
        const f = features[0];
        // f.properties.id = f.properties.id.slice(1);
        // console.log(f.properties.id);
        this.props.selectFeatures([f]);
        // this.draw.add(features[0]);
      }
    });
  };
  render() {
    return null;
  }
}

export const Draw = connect<any, any, any>(
  (state: IRootStateType, props) => ({
    selectedFeatures: state.draw.selectedFeatures
  }),
  { selectFeatures }
)(DrawComp);

// export class Drawx {
//   private draw;
//   private unsubscribe;
//   private map;
//   private dispatch;
//   constructor(map) {
//     this.unsubscribe = observe(
//       (state: IRootStateType) => state.draw.selectedFeatures,
//       this.stateChange
//     );
//     this.map = map;
//     this.draw = setupDraw();
//     attachToWindow('draw', this.draw);
//     map.addControl(this.draw);
//     map.on('click', this.clickHandler);
//   }
//   private stateChange = features => {
//     if (this.draw && Array.isArray(features) && features.length > 0) {
//       this.draw.add(features[0]);

//       this.draw.changeMode(`simple_select`, {
//         featureIds: features.map(f => f.properties.id)
//       });
//     }
//   };
//   private clickHandler = (e: any) => {
//     // set bbox as 5px reactangle area around clicked point
//     const bbox = [
//       [e.point.x - 5, e.point.y - 5],
//       [e.point.x + 5, e.point.y + 5]
//     ];
//     const features = this.map.queryRenderedFeatures(bbox, {
//       layers: ['park-volcanoes']
//     });
//     if (Array.isArray(features) && features.length > 0) {
//       store.dispatch(selectFeatures(features));
//       // this.draw.add(features[0]);
//     }
//   };
// }
