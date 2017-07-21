import MapboxDraw = require('@mapbox/mapbox-gl-draw');

export function setupDraw() {
  return new MapboxDraw({
    displayControlsDefault: true,
    controls: {
      lineString: true,
      polygon: true,
      trash: true
    }
  });
}
