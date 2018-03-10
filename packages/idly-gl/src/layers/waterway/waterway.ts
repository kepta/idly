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
        'line-width': {
          base: 4,
          stops: [[16, 8], [18, 16], [22, 40]],
        },
        'line-opacity': {
          base: 0.2,
          stops: [[16, 0.6], [18, 0.3], [22, 0.4]],
        },
        'line-offset': {
          base: 4,
          stops: [[16, 4], [18, 8], [22, 21]],
        },
      },
      filter: ['all', ['has', `${IDLY_NS}tag-waterway`]],
    },
  },
];
