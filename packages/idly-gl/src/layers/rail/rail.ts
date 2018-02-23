import { IDLY_NS } from '../../constants';
import { RAIL } from '../priorities';

export default [
  {
    selectable: true,
    priority: RAIL.ZERO,
    layer: {
      id: 'railway',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#555',
        'line-opacity': 0.85,
        'line-width': 5,
      },
      filter: ['all', ['in', `${IDLY_NS}tagsClass`, 'tag-railway']],
    },
  },
  {
    selectable: true,
    priority: RAIL.MINUS_1,
    layer: {
      id: 'railwayCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#eee',
        'line-opacity': 0.85,
        'line-width': 3,
        'line-dasharray': [1, 4],
      },
      filter: ['all', ['in', `${IDLY_NS}tagsClass`, 'tag-railway']],
    },
  },
];
