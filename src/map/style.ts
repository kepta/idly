import { fromJS, OrderedMap } from 'immutable';
import { ILayerSpec } from 'map/utils/layerFactory';
import { Style } from 'mapbox-gl';
import * as diff from 'mapbox-gl/src/style-spec/diff';

import * as R from 'ramda';
import { attachToWindow, getFromWindow } from 'utils/attach_to_window';

let globalStyle: Style = {
  version: 8,
  name: 'Satellite',
  metadata: { 'mapbox:autocomposite': true, 'mapbox:type': 'default' },
  center: [0, -1.1368683772161603e-13],
  zoom: 0.7414668730339613,
  bearing: 0,
  pitch: 0,
  sources: {
    mapbox: {
      url: 'mapbox://mapbox.satellite',
      type: 'raster',
      tileSize: 256
    }
  },
  sprite: 'mapbox://sprites/kushan2020/cj5tgoln94m2j2rqnyt5cyhuj',
  glyphs: 'mapbox://fonts/kushan2020/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'satellite',
      type: 'raster',
      source: 'mapbox',
      'source-layer': 'mapbox_satellite_full'
    }
  ]
};

const satLayer = fromJS({
  id: 'satellite',
  type: 'raster',
  source: 'mapbox',
  'source-layer': 'mapbox_satellite_full'
});

let Layers: OrderedMap<string, any> = OrderedMap({}).set('satellite', satLayer);

export function getStyle(): Style {
  return globalStyle;
}
attachToWindow('getStyle', getStyle);
export function updateStyle(s): Style {
  globalStyle = s;
  return globalStyle;
}

export function updateLayer(layer: ILayerSpec) {
  // const layer = layerSpec.toJS();
  // console.log('updating', layer.get('id'));
  Layers = Layers.set(layer.get('id'), layer);

  const newStyle = parseLayers(Layers, getStyle());
  const invokes = diff(getStyle(), newStyle);
  invokes.forEach(op => {
    getFromWindow('map')[op.command](...op.args);
  });
  // console.log(newStyle, getStyle(), Layers.toJS());

  updateStyle(newStyle);
}
export function removeLayer(layerId: string) {
  // console.log('removing', layerId);

  Layers = Layers.remove(layerId);

  const newStyle = parseLayers(Layers, getStyle());
  const invokes = diff(getStyle(), newStyle);
  invokes.forEach(op => {
    getFromWindow('map')[op.command](...op.args);
  });
  // console.log(newStyle, getStyle(), Layers.toJS());

  updateStyle(newStyle);
}

const parseLayers = (l: OrderedMap<string, any>, styleObj: Style) => {
  const layers = l
    .map(v => {
      let layer = v.toJS();
      layer = R.reject(R.isNil, layer);
      return layer;
    })
    .sort((a, b) => a.priority - b.priority)
    .toArray();
  // console.log(layers);
  const gStyle = R.clone(styleObj);
  gStyle.layers = layers;
  return gStyle;
};
