import * as React from 'react';
import mapboxgl = require('mapbox-gl');

import { fetchBbox } from '../store/osm';

import MapboxDraw = require('@mapbox/mapbox-gl-draw');
// import { fetchBbox } from '../network/osm';
// import Cache = require('caching-map');
/// <reference types="geojson" />
// <reference types="mapboxgl" />

// require('mapbox-gl/dist/mapbox-gl.css');
// require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');
// import Dimensions = require('react-dimensions');
interface PropsType {}

const datum: Map<string, object> = new Map();
var layersACtive: any = {};
export function* geb() {
  yield 'sk';
  yield '22';
  return 5;
}

export class Mapp extends React.Component<PropsType, any> {
  componentDidMount() {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoia3VzaGFuMjAyMCIsImEiOiJjaWw5dG56enEwMGV6dWVsemxwMWw5NnM5In0.BbEUL1-qRFSHt7yHMorwew';
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/satellite-v9', //stylesheet location
      center: [-74.5, 40], // starting position
      zoom: 9,
      hash: true
    });
    var win = window as any;
    win.mapp = map;
    var draw = new MapboxDraw({
      displayControlsDefault: true,
      controls: {
        polygon: true,
        trash: true
      }
    });
    map.addControl(draw);
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
    map.on('click', function(e: any) {
      // set bbox as 5px reactangle area around clicked point
      var bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ];
      var features = map.queryRenderedFeatures(bbox, {
        layers: Object.keys(layersACtive)
      });
      if (Array.isArray(features) && features[0]) draw.add(features[0]);
      console.log(features);
    });
    map.on('moveend', () => {
      const zoom = map.getZoom();
      if (zoom > 16) {
        fetchBbox(map.getBounds(), 16).forEach((p, i) => {
          p.promise
            .then((data: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>) => {
              var source = map.getSource(i + 'pink') as any;
              if (source) {
                layersACtive[i + 'pink' + 'points'] = true;
                source.setData(data);
              } else {
                layersACtive[i + 'pink' + 'points'] = true;

                map.addSource(i + 'pink', {
                  type: 'geojson',
                  data
                });
                map.addLayer({
                  id: 'park-volcanoes',
                  type: 'circle',
                  source: i + 'pink',
                  paint: {
                    'circle-radius': 6,
                    'circle-color': '#B42222'
                  },
                  filter: ['==', '$type', 'Point']
                });
                map.addLayer(genLayer(i + 'pink'));
                map.addLayer(genPoint(i + 'pink'));
              }
            })
            .catch(console.error);

          // var prom = fetchBbox(map.getBounds(), map.getZoom());
          // prom
          //   .then(r => {
          //     if (r && Array.isArray(r.features)) {
          //       r.features
          //         // .filter((el: any) => el.id.indexOf('way/') > -1)
          //         .forEach((el: any) => {
          //           datum.set(el.id, el);
          //         });
          //       var source: any = map.getSource('kujo');
          //       source &&
          //         source.setData({
          //           type: 'FeatureCollection',
          //           features: [...datum.values()]
          //         });
          //     }
          //   })
          //   .catch(e => console.error(e));
        });
      }
    });
    // map.on(
    //   'sourcedataloading',
    //   (dd: {
    //     tile?: { coord: { x: number; y: number; z: number } };
    //     type: string;
    //   }) => {
    //     console.log(dd.tile);
    //   }
    // );
    //     if (dd.tile) {
    //       var { x, y, z } = dd.tile.coord;

    //       if (z === 16 || z === 17) {
    //         var prom = fetchBbox(x, y, z);

    //   }
    // );
    map.on('load', function() {
      console.log('loaded');
      // });
      // map.addLayer({
      //   id: 'park-boundary',
      //   type: 'fill',
      //   source: 'national-park',
      //   paint: {
      //     'fill-color': '#888888',
      //     'fill-opacity': 0.4
      //   },
      //   filter: ['==', '$type', 'Polygon']
      // });
      // map.addLayer({
      //   id: 'park-volcanoes',
      //   type: 'circle',
      //   source: 'kujo',
      //   paint: {
      //     'circle-radius': 6,
      //     'circle-color': '#B42222'
      //   },
      //   filter: ['==', '$type', 'Point']
      // });
      // map.addLayer(layer);
    });
  }
  render() {
    return (
      <div>
        <div id="map" style={{ height: '100vh', width: '70vw' }} />
      </div>
    );
  }
}
