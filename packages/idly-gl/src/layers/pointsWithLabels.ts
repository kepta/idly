import { PLUGIN_NAME } from '../constants';

export default [
  {
    selectable: true,
    priority: 3,
    layer: {
      minzoom: 17,
      id: 'PointsWithLabelsLayer',
      type: 'symbol',
      source: undefined,
      layout: {
        'icon-image': `{${PLUGIN_NAME}--icon}-11`,
        'icon-allow-overlap': true,
        'text-field': `{${PLUGIN_NAME}--name}`,
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.05,
        'text-offset': [0, 1.5],
        'text-optional': true,
        'text-anchor': 'top',
        'text-allow-overlap': false
      },
      paint: {
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
        'text-halo-blur': 0.5
      },
      filter: [
        'all',
        ['has', `${PLUGIN_NAME}--icon`],
        ['==', '$type', 'Point'],
        ['!in', `${PLUGIN_NAME}--geometry`, 'vertex'] // OsmGeometry.VERTEX
      ]
    }
  }
];
