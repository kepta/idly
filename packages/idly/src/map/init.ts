/// <reference types="geojson" />
import * as React from 'react';
import { connect } from 'react-redux';
// import mapboxgl from 'mapbox-gl';
import mapboxgl = require('mapbox-gl');
import MapboxDraw = require('@mapbox/mapbox-gl-draw');
// const MapboxDraw = require('@mapbox/mapbox-gl-draw');
const SphericalMercator = require('@mapbox/sphericalmercator');

var mercator = new SphericalMercator({
  size: 256
});
import { RootStateType } from 'src/store/index';
import { getOSMTiles } from 'src/store/osm_tiles/actions';

interface PropsType {}

export const ZOOM = 16;
var layersACtive: any = {};
mapboxgl.accessToken =
  'pk.eyJ1Ijoia3VzaGFuMjAyMCIsImEiOiJjaWw5dG56enEwMGV6dWVsemxwMWw5NnM5In0.BbEUL1-qRFSHt7yHMorwew';
var genPoint = (source: string): mapboxgl.Layer => ({
  id: source + 'park-volcanoes',
  type: 'circle',
  source,
  paint: {
    'circle-radius': 6,
    'circle-color': '#B42222'
  },
  filter: ['==', '$type', 'Point']
});
var genLayer = (source: string): mapboxgl.Layer => ({
  id: source + 'points',
  type: 'line',
  source,
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#def',
    'line-width': 4
  }
});

export class MapGL {
  private map: mapboxgl.Map;
  private draw: MapboxDraw;
  cb: any;
  xy: number[][];
  constructor(container: string, callback: any) {
    this.map = new mapboxgl.Map({
      container, // container id
      style: 'mapbox://styles/mapbox/satellite-v9', //stylesheet location
      center: [-74.5, 40], // starting position
      zoom: 9,
      hash: true
    });
    this.cb = callback;
    this.map.on('load', () => {
      this.attachDraw();
    });
    this.map.on('click', this.onClick);
    this.map.on('moveend', this.onMoveEnd);
  }
  attach(event: string, callback: any) {
    this.map.on(event, callback);
  }
  attachDraw() {
    this.draw = new MapboxDraw({
      displayControlsDefault: true,
      controls: {
        polygon: true,
        trash: true
      }
    });
    this.map.addControl(this.draw);
  }
  updateSources(st) {
    this.xy.forEach((d, i) => {
      const data = st.get([d[0], d[1], ZOOM].join(','));
      if (!data || d[2] === 1) return;
      d[2] = 1;
      var source = this.map.getSource(i + 'pink') as any;
      if (source) {
        layersACtive[i + 'pink' + 'points'] = true;
        source.setData(data);
      } else {
        layersACtive[i + 'pink' + 'points'] = true;
        this.map.addSource(i + 'pink', {
          type: 'geojson',
          data
        });
        this.map.addLayer(genLayer(i + 'pink'));
        this.map.addLayer(genPoint(i + 'pink'));
      }
    });
  }
  onMoveEnd = () => {
    let zoom = this.map.getZoom();
    const ltlng = this.map.getBounds();
    if (zoom > ZOOM) {
      zoom = ZOOM; //Math.floor(zoom);
      const { minX, minY, maxX, maxY } = mercator.xyz(
        [ltlng.getWest(), ltlng.getSouth(), ltlng.getEast(), ltlng.getNorth()],
        zoom
      );
      this.xy = [];
      for (var x = minX; x <= maxX; x++) {
        for (var y = minY; y <= maxY; y++) {
          this.xy.push([x, y]);
        }
      }
      this.cb(this.xy, zoom);
    }
  };
  onClick = (e: any) => {
    // set bbox as 5px reactangle area around clicked point
    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    var features = this.map.queryRenderedFeatures(bbox, {
      layers: Object.keys(layersACtive)
    });
    if (Array.isArray(features) && features[0]) this.draw.add(features[0]);
    console.log(features);
  };
}
