import MapboxDraw = require('@mapbox/mapbox-gl-draw');

import { NodeMangler } from 'draw/customMode';
console.log(MapboxDraw.modes);
MapboxDraw.modes.simple_select.clickAnywhere = function(state, e) {
  // Clear the re-render selection
  const wasSelected = this.getSelectedIds();
  const wasSelectedFeatures = wasSelected.map(id => this.getFeature(id));
  console.log('simple_select wasSelected=', wasSelected);
  if (wasSelected.length > 0) {
    this.clearSelectedFeatures();
    this.deleteFeature(wasSelected);
  }
  // console.log('simple_select allFeatures', this.getAll());

  // if (wasSelected.length) {
  // this.clearSelectedFeatures();
  // wasSelected.forEach(id => this.deleteF(id));
  this.changeMode('NodeMangler', {
    wasSelected,
    wasSelectedFeatures,
    event: e
  });
  // }
  // doubleClickZoom.enable(this);
  this.stopExtendedInteractions(state);
};
export function setupDraw() {
  return new MapboxDraw({
    displayControlsDefault: true,
    clickBuffer: 3,
    doubleClickZoom: false,
    controls: {
      lineString: true,
      polygon: true,
      trash: true
    },
    defaultMode: 'NodeMangler',
    modes: {
      ...MapboxDraw.modes,
      NodeMangler
    }
  });
}
