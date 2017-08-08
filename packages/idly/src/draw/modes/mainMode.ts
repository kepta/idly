import { List, Set } from 'immutable';
import * as R from 'ramda';

import { observe, store } from 'common/store';
import { NodeFeature, nodeToFeat } from 'map/utils/nodeToFeat';

import { drawClearAction, drawSelectAction } from 'draw/store/draw.actions';
import { SELECTABLE_LAYERS } from 'map/constants';
import { wayToFeat } from 'map/utils/wayToFeat';

import { coreModifyAction } from 'core/store/core.actions';
import { entityToFeat } from 'draw/converters/entityToFeat';
import { featToEntities } from 'draw/converters/featToEntities';
import { Entities, Entity } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Way } from 'osm/entities/way';

const NodeMangler: any = {};

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

NodeMangler._render = function(x: Entities) {
  if (x.size === 0) return;
  const feat = entityToFeat(x);
  console.log(feat);
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
  const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
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
  const select: string[] = this.map
    .queryRenderedFeatures(bbox, {
      layers: SELECTABLE_LAYERS
    })
    .map(f => f.properties.id)
    .filter(R.identity);
  store.dispatch(drawSelectAction(Set(select)));
};

NodeMangler.onClickx = function(state, e) {
  const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
  const graph = store.getState().core.graph;
  const modifiedGraph = store.getState().core.modifiedGraph;
  let secondaryNodes = [];
  const featuresToSelect: List<NodeFeature> = List(
    this.map
      .queryRenderedFeatures(bbox, {
        layers: SELECTABLE_LAYERS
      })
      .map(f => {
        if (f.properties.id[0] === 'n')
          return (
            graph.getIn(['node', f.properties.id]) ||
            modifiedGraph.getIn(['node', f.properties.id])
          );
        if (f.properties.id[0] === 'w') {
          const toReturn: Way =
            graph.getIn(['way', f.properties.id]) ||
            modifiedGraph.getIn(['way', f.properties.id]);
          secondaryNodes = secondaryNodes.concat(toReturn.nodes.toArray());
          return toReturn;
        }
        if (f.properties.id[0] === 'r')
          return (
            graph.getIn(['relation', f.properties.id]) ||
            modifiedGraph.getIn(['relation', f.properties.id])
          );
      })
      .map((f: Entity) => {
        if (f instanceof Node) return nodeToFeat(f);
        if (f instanceof Way) return wayToFeat(f, graph);
      })
  );
  if (featuresToSelect.size === 0) return;
  const points = featuresToSelect.map(f => this.newFeature(f));
  points.forEach(point => this.addFeature(point));
  this.changeMode('simple_select', {
    featureIds: featuresToSelect.toArray().map(f => f.properties.id)
  });
  const storeFeatureToSelect = featuresToSelect
    .toArray()
    .map(f => f.properties.id)
    .concat(secondaryNodes);
  store.dispatch(selectFeatures(List(storeFeatureToSelect), List()));
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
