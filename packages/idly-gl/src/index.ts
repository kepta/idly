import * as geojson from './data.json';
import * as mapboxgl from 'mapbox-gl';
import layers from './layers';
import { addSource } from './helper/addSource';

(mapboxgl as any).accessToken =
  'pk.eyJ1Ijoia3VzaGFuMjAyMCIsImEiOiJjaWw5dG56enEwMGV6dWVsemxwMWw5NnM5In0.BbEUL1-qRFSHt7yHMorwew';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-68.13734351262877, 45.137451890638886],
  zoom: 5,
  hash: true
});
map.on('load', function() {
  map.addSource('virgin', {
    type: 'geojson',
    data: geojson
  });
  console.log(layers);
  layers.map(r => addSource(r.layer, 'virgin')).forEach(l => map.addLayer(l));
});
