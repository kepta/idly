/// <reference types="geojson" />
import * as React from 'react';
import { connect } from 'react-redux';
import { LngLatBounds } from 'mapbox-gl';

import { RootStateType } from 'src/store/index';
import { OsmTilesState } from 'src/store/osm_tiles/reducer';

import { getOSMTiles } from 'src/store/osm_tiles/actions';
import { MapGL } from 'src/map/init';
export const sum = (a, b) => a + b;

interface PropsType {
  osmTiles: OsmTilesState;
  getOSMTiles: (xy: number[][], zoom: number) => void;
}
const datum: Map<string, object> = new Map();
var layersACtive: any = {};

class MapComp extends React.Component<PropsType, any> {
  map: MapGL;
  componentDidMount() {
    this.map = new MapGL('map', this.handleMapMove);
    this.map.attach('moveend', () => console.log('here'));
  }
  handleMapMove = (xy: number[][], zoom: number) => {
    this.props.getOSMTiles(xy, zoom);
  };
  componentWillUpdate(nextProps: PropsType) {
    this.map.updateSources(nextProps.osmTiles.tiles);
  }
  render() {
    return (
      <div>
        <div id="map" style={{ height: '100vh', width: '100vw' }} />
      </div>
    );
  }
}

const Mapp = connect<any, any, any>(
  (state: RootStateType, props) => ({
    osmTiles: state.osmTiles
  }),
  { getOSMTiles }
)(MapComp);

export { Mapp };
