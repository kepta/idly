import mapboxgl = require('mapbox-gl');
mapboxgl.accessToken =
  'pk.eyJ1Ijoia3VzaGFuMjAyMCIsImEiOiJjaWw5dG56enEwMGV6dWVsemxwMWw5NnM5In0.BbEUL1-qRFSHt7yHMorwew';
export function genMapGl(divId: string) {
  return new mapboxgl.Map({
    container: divId, // container id
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-74.5, 40], // starting position
    zoom: 9,
    hash: true
  });
}
