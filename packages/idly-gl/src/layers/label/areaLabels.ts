import { IDLY_NS } from '../../constants';
import { LABEL } from '../priorities';

export default [
  {
    selectable: false,
    priority: LABEL.ZERO,
    layer: {
      id: 'AreaLabelsLayer',
      type: 'symbol',
      source: undefined,
      layout: {
        'symbol-placement': 'point',
        'icon-image': `{${IDLY_NS}icon}-12`,
        'icon-allow-overlap': true,
        'icon-offset': [0, 2],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-field': `{${IDLY_NS}name}`, // part 2 of this is how to do it
        'text-size': 9,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.05,
        'text-optional': true,
        'text-allow-overlap': false,
      },
      paint: {
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
        'text-halo-blur': 0.5,
      },
      filter: ['all', ['==', '$type', 'Polygon']],
    },
  },
];
