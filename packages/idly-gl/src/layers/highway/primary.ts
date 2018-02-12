import { PLUGIN_NAME } from '../../constants';

export default [
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'highwayPrimary',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#F99806',
        'line-opacity': 1,
        'line-width': [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          14,
          4,
          20,
          12,
        ],
      },
      filter: [
        'all',
        [
          'in',
          `${PLUGIN_NAME}--tagsClassType`,
          'tag-highway-primary',
          'tag-highway-primary_link',
        ],
      ],
    },
  },
  {
    selectable: false,
    priority: 1.9,
    layer: {
      id: 'highwayPrimaryCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#000',
        'line-opacity': 1,
        'line-width': [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          14,
          6,
          20,
          18,
        ],
      },
      filter: [
        'all',
        [
          'in',
          `${PLUGIN_NAME}--tagsClassType`,
          'tag-highway-primary',
          'tag-highway-primary_link',
        ],
      ],
    },
  },
];
