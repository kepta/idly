import { PLUGIN_NAME } from '../../constants';

export default [
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'highwayTertiary',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#FFF9B3',
        'line-opacity': 0.85,
        'line-width': 5
      },
      filter: [
        'all',
        [
          'in',
          `${PLUGIN_NAME}--tagsClassType`,
          'tag-highway-tertiary',
          'tag-highway-tertiary_link'
        ]
      ]
    }
  },
  {
    selectable: true,
    priority: -2,
    layer: {
      id: 'highwayTertiaryCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#70372f',
        'line-opacity': 1,
        'line-width': 10
      },
      filter: [
        'all',
        [
          'in',
          `${PLUGIN_NAME}--tagsClassType`,
          'tag-highway-tertiary',
          'tag-highway-tertiary_link'
        ]
      ]
    }
  }
];
