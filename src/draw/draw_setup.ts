import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { DRAW_CLICK_BUFFER } from 'draw/config';
import { NodeMangler } from 'draw/modes/mainMode';
/**
 * @TOFIX need to figure out for direct_Select
 *  need it to scale!
 */

MapboxDraw.modes.simple_select.clickAnywhere = function(state, e) {
  // Clear the re-render selection
  const wasSelected = this.getSelectedIds();
  const wasSelectedFeatures = wasSelected.map(id => this.getFeature(id));
  // console.log('simple_select wasSelected=', wasSelected);
  // if (wasSelected.length > 0) {
  //   this.clearSelectedFeatures();
  //   this.deleteFeature(wasSelected);
  // }
  this.changeMode('NodeMangler', {
    wasSelected,
    wasSelectedFeatures,
    event: e
  });
  this.stopExtendedInteractions(state);
};

MapboxDraw.modes.direct_select.clickNoTarget = function() {
  const wasSelected = this.getSelectedIds();
  const wasSelectedFeatures = wasSelected.map(id => this.getFeature(id));
  this.changeMode('NodeMangler', {
    wasSelected,
    wasSelectedFeatures
  });
};

MapboxDraw.modes.direct_select.clickInactive = function() {
  const wasSelected = this.getSelectedIds();
  const wasSelectedFeatures = wasSelected.map(id => this.getFeature(id));
  this.changeMode('NodeMangler', {
    wasSelected,
    wasSelectedFeatures
  });
};

export function setupDraw() {
  return new MapboxDraw({
    displayControlsDefault: true,
    clickBuffer: DRAW_CLICK_BUFFER,
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
