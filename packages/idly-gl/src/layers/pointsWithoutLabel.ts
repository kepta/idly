import { IDLY_NS } from '../constants';

export default [
  {
    selectable: true,
    priority: 3,
    layer: {
      minzoom: 17,
      id: 'PointsWithoutLabelsLayer',
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
        /**
         * @REVISIT this vertex problem
         */
        ['!in', `${IDLY_NS}geometry`, 'vertex'], // OsmGeometry.VERTEX
      ],
    },
  },
];
