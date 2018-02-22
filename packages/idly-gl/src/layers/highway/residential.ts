import { IDLY_NS } from '../../constants';

export default [
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'highwayResidential',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#FFF',
        'line-opacity': 0.85,
        'line-width': 10,
      },
      filter: [
        'all',
        [
          'in',
          `${IDLY_NS}tagsClassType`,
          'tag-highway-residential',
          'tag-highway-residential_link',
          'tag-highway-service',
        ],
      ],
    },
  },
];
