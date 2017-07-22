import MapboxDraw = require('@mapbox/mapbox-gl-draw');

export function setupDraw() {
  return new MapboxDraw({
    displayControlsDefault: true,
    clickBuffer: 3,
    controls: {
      lineString: true,
      polygon: true,
      trash: true
    }
  });
}
