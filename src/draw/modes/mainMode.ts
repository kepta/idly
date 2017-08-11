import { Set } from 'immutable';
import * as R from 'ramda';

import { observe, store } from 'common/store';

import { drawClearAction, drawSelectAction } from 'draw/store/draw.actions';
import { SELECTABLE_LAYERS } from 'map/layers/layers';

import { coreModifyAction } from 'core/store/core.actions';
import { entityToFeat } from 'draw/converters/entityToFeat';
import { featToEntities } from 'draw/converters/featToEntities';
import { Entities } from 'osm/entities/entities';

const NodeMangler: any = {};
let prev = null;
NodeMangler.onSetup = function(opts) {
  const state = {
    observe: observe(
      s => s.draw.selected,
      NodeMangler._render.bind(this),
      (p, n) => {
        return !p.equals(n);
      }
    )
  };
  setTimeout(() => {
    this.map.doubleClickZoom.disable();
  }, 0);

  if (opts.wasSelected) {
    if (opts.wasSelected.length > 0) {
      this.clearSelectedFeatures();
      this.deleteFeature(opts.wasSelected);
    }
    this._onCommit(opts.wasSelectedFeatures);
    /**
     * @TOFIX figure out the click!, I mean this whole
     *  click from anywhere thing is crazy. also need
     *  to centralize / control the thing in draw_setup
     *
     */
    if (opts.event) {
      // setTimeout(() => this.onClick(null, opts.event), 0);
    }
  }
  return state;
};
/**
 * @TOFIX rending is buggy, it causes artifcats
 *  and is unreliable, FIX IT !
 */
NodeMangler._render = function(x: Entities) {
  // console.log(x, prev, x.equals(prev));
  prev = x;
  if (x.size === 0) return;
  const feat = entityToFeat(x);
  // console.log(feat);
  const points = feat.map(f => this.newFeature(f));
  points.forEach(point => this.addFeature(point));

  this.changeMode('simple_select', {
    featureIds: points.map(f => f.properties.id)
  });
};

NodeMangler._onCommit = function(feats) {
  const entities = featToEntities(feats);
  store.dispatch(drawClearAction());
  store.dispatch(coreModifyAction(entities));
};

NodeMangler.onStop = function(state, e) {
  console.log('unsbscribing', state.observe());
};

NodeMangler.onClick = function(state, e) {
  const bbox = [[e.point.x - 4, e.point.y - 4], [e.point.x + 4, e.point.y + 4]];
  /**
   * @NOTE this queryRender can return duplicates sometime!
   *
   * @TOFIX due to a bug in mapboxgl (I Guess)
   *  what happens is, when you click on the map
   *  http://localhost:5000/#17.22/51.51006/-0.01412
   *  at `w24232130` if you click on the right side mouse([[478,250],[488,260]])
   *  you get a way geometry of length 4 (wrong behaviour) and when you click [[283,306],[293,316]]
   *  you get a way with geometry of length 5, (correct behavior).
   */

  const select: Set<string> = R.compose(
    Set,
    R.take(1),
    R.reject(R.isNil),
    R.map(R.path(['properties', 'id']))
  )(
    this.map.queryRenderedFeatures(bbox, {
      layers: SELECTABLE_LAYERS
    })
  );

  store.dispatch(drawSelectAction(select));
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
