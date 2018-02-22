import { IDLY_NS } from '../../constants';

export default [
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'highwayUnclassified',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#dcd9b9',
        'line-opacity': 0.85,
        'line-width': 8,
      },
      filter: [
        'all',
        ['in', `${IDLY_NS}tagsClassType`, 'tag-highway-unclassified'],
      ],
    },
  },
];
