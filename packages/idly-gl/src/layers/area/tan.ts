// tag-landuse-farmyard
import { PLUGIN_NAME } from '../../constants';
import { areaPaintStyle } from './helper';

const filter = [
  'all',
  ['==', '$type', 'Polygon'],
  ['in', `${PLUGIN_NAME}--tagsClassType`, 'tag-landuse-farmyard']
];

export default [
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaTanLayer',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#f5dcba',
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
      id: 'areaTanLayerCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: { ...areaPaintStyle, 'line-color': '#f5dcba' },
      filter
    }
  }
];
