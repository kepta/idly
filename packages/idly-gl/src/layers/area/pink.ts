import { IDLY_NS } from '../../constants';
import { areaPaintStyle } from './helper';

const filter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-landuse-industrial',
    'tag-power-plant',
  ],
];

export default [
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaPinkLayer',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#e4a4f5',
        'line-width': 2,
        'line-opacity': 1,
      },
      filter,
    },
  },
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaPinkLayerCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: { ...areaPaintStyle, 'line-color': '#e4a4f5' },
      filter,
    },
  },
];
