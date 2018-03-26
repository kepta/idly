import { INTERACTIVE } from '../priorities';

export default [
  {
    selectable: true,
    hide: true,
    internal: true,
    priority: INTERACTIVE.ZERO,
    layer: {
      minzoom: 18.5,
      id: 'interactive-points-draggable',
      source: undefined,
      type: 'circle',
      layout: {},
      paint: {
        'circle-radius': 3,
        'circle-color': '#EAB4E9',
      },
      filter: ['all'],
    },
  },
  {
    selectable: true,
    hide: true,
    internal: true,
    priority: INTERACTIVE.MINUS_1,
    layer: {
      minzoom: 18.5,
      id: 'interactive-points-draggable-stroke',
      source: undefined,
      type: 'circle',
      layout: {},
      paint: {
        'circle-radius': 4,
        'circle-color': '#fff',
        'circle-stroke-width': 1,
      },
      filter: ['all'],
    },
  },
];
