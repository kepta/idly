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
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#F99806',
        'line-opacity': 1,
        'line-width': 10
      },
      filter: [
        'all',
        [
          'in',
          `${PLUGIN_NAME}--tagsClassType`,
          'tag-highway-primary',
          'tag-highway-primary_link'
        ]
      ]
    }
  }
];
