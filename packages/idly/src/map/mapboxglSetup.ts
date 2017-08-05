import { getStyle } from 'map/layers/style';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import { attachToWindow } from 'utils/attach_to_window';

mapboxgl.accessToken =
  'pk.eyJ1Ijoia3VzaGFuMjAyMCIsImEiOiJjaWw5dG56enEwMGV6dWVsemxwMWw5NnM5In0.BbEUL1-qRFSHt7yHMorwew';
attachToWindow('mapboxgl', mapboxgl);

export function mapboxglSetup(divId: string) {
  return new mapboxgl.Map({
    container: divId, // container id
    style: getStyle(),
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
