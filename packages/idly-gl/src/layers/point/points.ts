import { IDLY_NS } from '../../constants';
import { POINT } from '../priorities';

export default [
  {
    selectable: true,
    priority: POINT.ZERO,
    layer: {
      minzoom: 17,
      id: 'point-point',
      source: undefined,
      type: 'circle',
      layout: {},
      paint: {
        'circle-radius': 6,
        'circle-color': '#eeeeee',
        'circle-stroke-width': 0.5,
      },
      filter: [
        'all',
        ['!has', `${IDLY_NS}icon`],
        ['==', '$type', 'Point'],
        ['!in', `${IDLY_NS}geometry`, 'vertex'], // OsmGeometry.VERTEX
      ],
    },
  },
];
