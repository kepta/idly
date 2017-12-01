import { PLUGIN_NAME } from '../../constants';

export default [
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'waterway',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#77d3de',
        'line-opacity': 0.85,
        'line-width': 5
      },
      filter: ['all', ['in', `${PLUGIN_NAME}--tagsClass`, 'tag-waterway']]
    }
  }
];
