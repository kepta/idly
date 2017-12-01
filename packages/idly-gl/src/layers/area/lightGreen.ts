import { areaPaintStyle } from './helper';
import { PLUGIN_NAME } from '../../constants';

const filter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${PLUGIN_NAME}--tagsClassType`,
    'tag-landuse-cemetery',
    'tag-landuse-orchard',
    'tag-landuse-meadow',
    'tag-landuse-farm',
    'tag-landuse-farmland'
  ]
];

export default [
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaLightGreenLayer',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#c7d3a0',
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
      id: 'areaLightGreenLayerCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: { ...areaPaintStyle, 'line-color': '#c7d3a0' },
      filter
    }
  }
];
