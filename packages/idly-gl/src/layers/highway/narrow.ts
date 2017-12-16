import { PLUGIN_NAME } from '../../constants';

export default [
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'highwayTrack',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#c5b59f',
        'line-opacity': 1,
        'line-width': 8
      },
      filter: [
        'all',
        ['in', `${PLUGIN_NAME}--tagsClassType`, 'tag-highway-track']
      ]
    }
  },
  {
    selectable: true,
    priority: 2,
    layer: {
      id: 'highwayNarrow',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#c5b59f',
        'line-opacity': 0.7,
        'line-width': 5
      },
      filter: [
        'all',
        [
          'in',
          `${PLUGIN_NAME}--tagsClassType`,
          'tag-highway-path',
          'tag-highway-footway',
          'tag-highway-bridleway',
          'tag-highway-cycleway'
        ]
      ]
    }
  },
  {
    selectable: false,
    priority: 2.5,
    layer: {
      id: 'highwayNarrowCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#FFF',
        'line-opacity': 1,
        'line-width': {
          base: 1,
          stops: [[8, 3], [12, 5]]
        },
        'line-dasharray': [0.4, 2]
      },
      filter: [
        'all',
        [
          'in',
          `${PLUGIN_NAME}--tagsClassType`,
          'tag-highway-path',
          'tag-highway-footway',
          'tag-highway-bridleway',
          'tag-highway-cycleway'
        ]
      ]
    }
  }
];
