import mapboxgl = require('mapbox-gl');
mapboxgl.accessToken =
  'pk.eyJ1Ijoia3VzaGFuMjAyMCIsImEiOiJjaWw5dG56enEwMGV6dWVsemxwMWw5NnM5In0.BbEUL1-qRFSHt7yHMorwew';
export function mapboxglSetup(divId: string) {
  return new mapboxgl.Map({
    container: divId, // container id
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-0.0143, 51.5122], // starting position
    zoom: 16,
    hash: true,
    doubleClickZoom: false
  });
}

export const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});
