import { store } from 'common/store';
import { Controller } from 'map2/controller';
import { featureCollection, styleGen } from 'map2/styleGen';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-dev';
import * as React from 'react';
import sizeMe from 'react-sizeme';
import { attachToWindow } from 'utils/attach_to_window';

mapboxgl.accessToken =
  'pk.eyJ1Ijoia3VzaGFuMjAyMCIsImEiOiJjaWw5dG56enEwMGV6dWVsemxwMWw5NnM5In0.BbEUL1-qRFSHt7yHMorwew';

class MapComp extends React.PureComponent<any, any> {
  state = {
    mapStyle: null,
    map: null
  };
  async componentDidMount() {
    const mapStyle = styleGen();
    const map = new mapboxgl.Map({
      container: 'map-container',
      style: mapStyle([])({
        virgin: {
          type: 'geojson',
          data: featureCollection()
        }
      }),
      center: [-73.97694, 40.76109],
      zoom: 17,
      hash: true,
      doubleClickZoom: false,
      trackResize: true
    });
    attachToWindow('map', map);

    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
      this.setState({
        map,
        mapStyle
      });
    });
  }
  componentWillUnmount() {
    // tslint:disable-next-line:no-unused-expression
    this.state.map && this.state.map.remove();
  }
  render() {
    return (
      <div style={{ flexGrow: 1 }}>
        <div id="map-container" style={{ height: this.props.size.height }} />
        {this.state.map && <Controller {...this.props} {...this.state} />}
      </div>
    );
  }
}

export const Map = sizeMe({ monitorHeight: true, monitorWidth: true })(MapComp);
