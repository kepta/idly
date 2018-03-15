import { INTERACTIVE } from '../priorities';

export default [
  {
    selectable: true,
    hide: false,
    priority: INTERACTIVE.ZERO,
    layer: {
      minzoom: 18.5,
      id: 'PointsDraggableLayer',
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
    hide: false,
    priority: INTERACTIVE.MINUS_1,
    layer: {
      minzoom: 18.5,
      id: 'PointsDraggableStrokeLayer',
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
