import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl-dev.js';
import { TopoJSONSource } from './source';
require('mapbox-gl/dist/mapbox-gl.css');

mapboxgl.accessToken =
  'pk.eyJ1Ijoia3VzaGFuMjAyMCIsImEiOiJjaWw5dG56enEwMGV6dWVsemxwMWw5NnM5In0.BbEUL1-qRFSHt7yHMorwew';

// console.log(TopoJSONSource);

var map = new mapboxgl.Map({
  container: 'map',
  zoom: 5.2,
  center: [-119.393, 36.883],
  style: 'mapbox://styles/mapbox/streets-v8'
});
window.map = map;
map.addSourceType('topojson', TopoJSONSource);

map.on('load', function() {
  map.addSource('counties', {
    type: 'topojson',
    data: 'ca.json',
    workerOptions: {
      layer: 'counties'
    }
  });

  map.addLayer(
    {
      id: 'county-boundaries',
      type: 'line',
      source: 'counties',
      paint: {
        'line-color': '#EC8D8D',
        'line-width': 20
      }
    },
    'country-label-lg'
  );
});
