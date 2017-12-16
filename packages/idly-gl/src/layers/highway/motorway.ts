import { PLUGIN_NAME } from '../../constants';

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
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#CF2081',
        'line-opacity': 1,
        'line-width': 10
      },
      filter: [
        'all',
        [
          'in',
          `${PLUGIN_NAME}--tagsClassType`,
          'tag-highway-motorway',
          /**
           * @TOFIX iD uses a mix of x_link and x-link.
           */
          'tag-highway-motorway_link'
        ]
      ]
    }
  }
];
