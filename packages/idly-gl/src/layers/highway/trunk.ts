import { PLUGIN_NAME } from '../../constants';

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
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#DD2F22',
        'line-opacity': 0.85,
        'line-width': 5
      },
      filter: [
        'all',
        [
          'in',
          `${PLUGIN_NAME}--tagsClassType`,
          'tag-highway-trunk',
          'tag-highway-trunk_link'
        ]
      ]
    }
  }
];
