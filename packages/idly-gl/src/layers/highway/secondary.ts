import { IDLY_NS } from '../../constants';

export default [
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'highwaySecondary',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#F3F312',
        'line-opacity': 1,
        'line-width': 10,
      },
      filter: [
        'all',
        [
          'in',
          `${IDLY_NS}tagsClassType`,
          'tag-highway-secondary',
          'tag-highway-secondary_link',
        ],
      ],
    },
  },
];
