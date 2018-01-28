export default [
  {
    layer: {
      filter: ['all', ['==', '$type', 'LineString']],
      id: 'LineStringBlackShadow',
      layout: {},
      paint: {
        'line-color': '#551A8B',
        'line-opacity': 0.5,
        'line-width': 18,
        // 'line-blur': 2
      },
      source: undefined,
      type: 'line',
    },
    priority: 4.9,
    selectable: false,
  },
  {
    layer: {
      filter: ['all', ['==', '$type', 'LineString']],
      id: 'LineStringWhiteShadow',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#ccc',
        'line-opacity': 1,
        'line-width': 16,
      },
      source: undefined,
      type: 'line',
    },
    priority: 5,
    selectable: false,
  },
  {
    layer: {
      filter: ['==', '$type', 'Polygon'],
      id: 'PolygonWhiteShadow',
      layout: {},
      paint: {
        'line-color': '#FFF',
        'line-offset': -2,
        'line-width': 10,
      },
      source: undefined,
      type: 'line',
    },
    priority: 4.9,
    selectable: false,
  },
  {
    layer: {
      filter: ['==', '$type', 'Polygon'],
      id: 'PolygonBlackShadow',
      layout: {},
      paint: {
        'line-color': '#551A8B',
        'line-offset': -6,
        'line-opacity': 0.5,
        'line-width': 2,
      },
      source: undefined,
      type: 'line',
    },
    priority: 5,
    selectable: false,
  },
];
