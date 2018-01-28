import { PLUGIN_NAME } from '../../constants';
import { areaPaintStyle } from './helper';

const filter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${PLUGIN_NAME}--tagsClassType`,
    'tag-landuse-retail',
    'tag-landuse-commercial',
    'tag-landuse-landfill',
    'tag-military',
    'tag-landuse-military'
  ]
];

export default [
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaOrangeLayer',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#d6881a',
        'line-width': 2,
        'line-opacity': 1
      },
      filter
    }
  },
  {
    priority: 1,
    selectable: false,
    layer: {
      id: 'areaOrangeLayerCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: { ...areaPaintStyle, 'line-color': '#d6881a' },
      filter
    }
  }
];
