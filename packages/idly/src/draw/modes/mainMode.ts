import { List } from 'immutable';
import * as R from 'ramda';

import { store } from 'common/store';
import { NodeFeature } from 'map/utils/nodeToFeat';

import { selectFeatures } from 'draw/store/draw.actions';
import { SELECTABLE_LAYERS } from 'map/constants';

const NodeMangler: any = {};

NodeMangler.onSetup = function(opts) {
  const state = {};

  setTimeout(() => {
    this.map.doubleClickZoom.disable();
  }, 0);

  if (opts.wasSelected) {
    console.log('nodemangler/opts.wasselected', opts);
    const featuresThatWereSelected: List<NodeFeature> = List(
      R.uniqBy((a: any) => a.id, opts.wasSelectedFeatures).map(f => ({
        type: f.type,
        id: f.properties.id,
        geometry: {
          type: f.type,
          coordinates: f.coordinates
        },
        properties: f.properties
      }))
    );
    store.dispatch(selectFeatures(List(), featuresThatWereSelected));
    if (opts.event) {
      setTimeout(() => this.onClick(null, opts.event), 0);
    }
  }
  return state;
};

// Whenever a user clicks on the map, Draw will call `onClick`
/**
 * @TOFIX due to a bug in mapboxgl (I Guess)
 *  what happens is, when you click on the map
 *  http://localhost:5000/#17.22/51.51006/-0.01412
 *  at `w24232130` if you click on the right side mouse([[478,250],[488,260]])
 *  you get a way geometry of length 4 (wrong behaviour) and when you click [[283,306],[293,316]]
 *  you get a way with geometry of length 5, (correct behavior).
 */
NodeMangler.onClick = function(state, e) {
  console.log(e);
  const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
  const featuresToSelect: List<NodeFeature> = List(
    this.map
      .queryRenderedFeatures(bbox, {
        layers: SELECTABLE_LAYERS
      })
      .map(f => ({
        ...f,
        id: f.properties.id,
        geometry: f.geometry
      }))
  );
  if (featuresToSelect.size === 0) return;
  const points = featuresToSelect.map(f => this.newFeature(f));
  points.forEach(point => this.addFeature(point));
  this.changeMode('simple_select', {
    featureIds: featuresToSelect.toArray().map(f => f.properties.id)
  });
  store.dispatch(selectFeatures(featuresToSelect, List()));
};

NodeMangler.onMouseUp = function(state, e) {
  console.log('mouseu[p', e);
};

NodeMangler.onDrag = function(state, e) {
  console.log('dragging,', state, e);
};

NodeMangler.onStop = function(state, e) {
  console.log('onStop', state, e);
};

NodeMangler.toDisplayFeatures = function(state, geojson, display) {
  console.log('toDisplayFeatures', state, geojson);
  display(geojson);
};

export { NodeMangler };
