import { fromJS } from 'immutable';
import { PLUGIN_NAME } from '../../constants';
import { addSource } from '../../helper/addSource';

const filter = fromJS([
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    ['==', `${PLUGIN_NAME}--tagsClassType`, 'tag-amenity-shelter'],
    ['==', `${PLUGIN_NAME}--tagsClass`, 'tag-building']
  ]
]);

const layer = {
  minzoom: 17,
  id: 'areaBuildingLayer',
  type: 'line',
  source: undefined,
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#e06e5f',
    'line-width': 2,
    'line-opacity': 1
  },
  filter
};

const layerFill = {
  id: 'areaBuildingLayerFill',
  type: 'fill',
  source: undefined,
  paint: {
    'fill-opacity': 0.2,
    'fill-color': '#e06e5f'
  },
  filter
};

export const areaBuildingLayer = (sourceName: string) => ({
  selectable: false,
  priority: 2,
  layer: addSource(layer, sourceName)
});

export const areaBuildingLayerFill = (sourceName: string) => ({
  selectable: false,
  priority: 1,
  layer: addSource(layerFill, sourceName)
});
