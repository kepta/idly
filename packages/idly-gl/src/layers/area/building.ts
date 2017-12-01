import { PLUGIN_NAME } from '../../constants';

const filter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    ['==', `${PLUGIN_NAME}--tagsClassType`, 'tag-amenity-shelter'],
    ['==', `${PLUGIN_NAME}--tagsClass`, 'tag-building']
  ]
];

export default [
  {
    selectable: false,
    priority: 2,
    layer: {
      id: 'areaBuildingLayer',
      minzoom: 17,
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
    }
  },
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaBuildingLayerFill',
      type: 'fill',
      source: undefined,
      paint: {
        'fill-opacity': 0.2,
        'fill-color': '#e06e5f'
      },
      filter
    }
  }
];
