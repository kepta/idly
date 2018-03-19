import { IDLY_NS } from '../../constants';
import { POINT } from '../priorities';

export default [
  {
    selectable: true,
    priority: POINT.ZERO,
    layer: {
      minzoom: 17,
      id: 'PointsIntersection',
      source: undefined,
      type: 'circle',
      layout: {},
      paint: {
        'circle-radius': 4,
        'circle-color': '#111',
        'circle-opacity': 0.85,
      },
      filter: [
        'all',
        ['==', `${IDLY_NS}intersection`, true], // OsmGeometry.VERTEX
      ],
    },
  },
];
