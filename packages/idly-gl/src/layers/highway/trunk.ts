import { IDLY_NS } from '../../constants';

export default [
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'highwayTrunk',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#DD2F22',
        'line-opacity': 0.85,
        'line-width': 9,
      },
      filter: [
        'all',
        [
          'in',
          `${IDLY_NS}tagsClassType`,
          'tag-highway-trunk',
          'tag-highway-trunk_link',
        ],
      ],
    },
  },
];
