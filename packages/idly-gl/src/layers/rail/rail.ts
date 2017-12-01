import { PLUGIN_NAME } from '../../constants';

export default [
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'railway',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#555',
        'line-opacity': 0.85,
        'line-width': 5
      },
      filter: ['all', ['in', `${PLUGIN_NAME}--tagsClass`, 'tag-railway']]
    }
  },
  {
    selectable: true,
    priority: 2.5,
    layer: {
      id: 'railwayCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#eee',
        'line-opacity': 0.85,
        'line-width': 3,
        'line-dasharray': [1, 4]
      },
      filter: ['all', ['in', `${PLUGIN_NAME}--tagsClass`, 'tag-railway']]
    }
  }
];
