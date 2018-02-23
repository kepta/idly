import { IDLY_NS } from '../../constants';
import { WATERWAY } from '../priorities';

export default [
  {
    selectable: true,
    priority: WATERWAY.ZERO,
    layer: {
      id: 'waterway',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#77d3de',
        'line-opacity': 0.85,
        'line-width': 5,
      },
      filter: ['all', ['in', `${IDLY_NS}tagsClass`, 'tag-waterway']],
    },
  },
];
