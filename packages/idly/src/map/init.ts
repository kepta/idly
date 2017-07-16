/// <reference types="geojson" />
import * as React from 'react';
import { connect } from 'react-redux';
import mapboxgl = require('mapbox-gl');
import MapboxDraw = require('@mapbox/mapbox-gl-draw');

import { RootStateType } from 'src/store/';
import { getOSMTiles } from 'src/store/osm_tiles/actions';
import { fetchBbox } from 'src/store/osm';

interface PropsType {}
const datum: Map<string, object> = new Map();
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
  constructor(container: string) {
    this.map = new mapboxgl.Map({
      container, // container id
      style: 'mapbox://styles/mapbox/satellite-v9', //stylesheet location
      center: [-74.5, 40], // starting position
      zoom: 9,
      hash: true
    });
    this.map.on('click', function(e: any) {
      // set bbox as 5px reactangle area around clicked point
      var bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ];
      var features = this.map.queryRenderedFeatures(bbox, {
        layers: Object.keys(layersACtive)
      });
      if (Array.isArray(features) && features[0]) this.draw.add(features[0]);
      console.log(features);
    });
    this.map.on('moveend', this.onMoveEnd);
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
  onMoveEnd = () => {
    const zoom = this.map.getZoom();
    if (zoom > 16) {
      fetchBbox(this.map.getBounds(), 16).forEach((p, i) => {
        p.promise
          .then((data: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>) => {
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
          })
          .catch(console.error);
      });
    }
  };
}
