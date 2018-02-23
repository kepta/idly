import { IDLY_NS } from '../../constants';
import { LABEL } from '../priorities';

export default [
  {
    selectable: true,
    priority: LABEL.PLUS_2,
    layer: {
      minzoom: 17,
      id: 'PointsWithLabelsLayer',
      type: 'symbol',
      source: undefined,
      layout: {
        'icon-image': `{${IDLY_NS}icon}-15`,
        'icon-allow-overlap': true,
        'text-field': `{${IDLY_NS}name}`,
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.05,
        'text-offset': [0, 1.5],
        'text-optional': true,
        'text-anchor': 'top',
        'text-allow-overlap': false,
      },
      paint: {
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
        'text-halo-blur': 0.5,
      },
      filter: [
        'all',
        ['has', `${IDLY_NS}icon`],
        ['!in', `${IDLY_NS}geometry`, 'vertex'], // OsmGeometry.VERTEX
      ],
    },
  },
];
