import { IDLY_NS } from '../../constants';

export default [
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'highwayMotorway',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#CF2081',
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
          `${IDLY_NS}tagsClassType`,
          'tag-highway-motorway',
          /**
           * @TOFIX iD uses a mix of x_link and x-link.
           */
          'tag-highway-motorway_link',
        ],
      ],
    },
  },
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'highwayMotorwayCase',
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
          `${IDLY_NS}tagsClassType`,
          'tag-highway-motorway',
          /**
           * @TOFIX iD uses a mix of x_link and x-link.
           */
          'tag-highway-motorway_link',
        ],
      ],
    },
  },
];
