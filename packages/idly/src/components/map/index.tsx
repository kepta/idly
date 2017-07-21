/// <reference types="geojson" />
import { LngLatBounds } from 'mapbox-gl';
import * as React from 'react';
import { connect } from 'react-redux';

import { IRootStateType } from 'store/index';
import { OsmTilesState } from 'store/osm_tiles/reducer';

// import { MapGL } from 'map/init';
import { Map as MapGl } from 'map/map';

import { getOSMTiles } from 'store/osm_tiles/actions';
export const sum = (a, b) => a + b;

interface PropsType {
  osmTiles: OsmTilesState;
  getOSMTiles: (xy: number[][], zoom: number) => void;
}
const datum: Map<string, object> = new Map();
const layersACtive: any = {};

class MapComp extends React.Component<PropsType, any> {
  // map: MapGL;
  componentDidMount() {
    new MapGl('map');
    // this.map = new MapGL('map', this.handleMapMove);
    // this.map.attach('moveend', () => console.log('here'));
  }
  handleMapMove = (xy: number[][], zoom: number) => {
    // unmountMap();
    // this.props.getOSMTiles(xy, zoom);
  };
  componentWillUpdate(nextProps: PropsType) {
    // this.map.updateSources(nextProps.osmTiles.tiles);
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
  (state: IRootStateType, props) => ({
    osmTiles: state.osmTiles
  }),
  { getOSMTiles }
)(MapComp);

export { Mapp };
