import { IDLY_NS } from '../constants';

export default [
  {
    selectable: false,
    priority: 5,
    layer: {
      id: 'LineLabelLayer',
      type: 'symbol',
      source: undefined,
      layout: {
        'symbol-placement': 'line',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-field': `{${IDLY_NS}name}`, // part 2 of this is how to do it
        'text-size': 12,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.05,
        'text-optional': true,
        'text-allow-overlap': false,
      },
      paint: {
        'text-halo-color': '#ffffff',
        'text-halo-width': 3.5,
        'text-halo-blur': 0.3,
      },
      filter: ['all', ['==', '$type', 'LineString']],
    },
  },
];
