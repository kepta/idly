import { PLUGIN_NAME } from '../../constants';
import { areaPaintStyle } from './helper';

const filter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${PLUGIN_NAME}--tagsClassType`,
    'tag-amenity-swimming_pool',
    'tag-leisure-swimming_pool',
    'tag-natural-water',
    'tag-landuse-aquaculture',
    'tag-landuse-basin',
    'tag-landuse-harbour',
    'tag-landuse-reservoir'
  ]
];

export default [
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaBlueLayer',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#77d3de',
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
      id: 'areaBlueLayerCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: { ...areaPaintStyle, 'line-color': '#77d3de' },
      filter
    }
  }
];
