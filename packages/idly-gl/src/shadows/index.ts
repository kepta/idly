export default [
  {
    selectable: false,
    priority: 4.9,
    layer: {
      id: 'LineStringBlackShadow',
      type: 'line',
      source: undefined,
      layout: {},
      paint: {
        'line-color': '#551A8B',
        'line-opacity': 0.5,
        'line-width': 14
        // 'line-blur': 2
      },
      filter: ['all', ['==', '$type', 'LineString']]
    }
  },
  {
    selectable: false,
    priority: 5,
    layer: {
      id: 'LineStringWhiteShadow',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ccc',
        'line-opacity': 1,
        'line-width': 12
      },
      filter: ['all', ['==', '$type', 'LineString']]
    }
  },
  {
    selectable: false,
    priority: 4.9,
    layer: {
      id: 'PolygonWhiteShadow',
      type: 'line',
      source: undefined,
      layout: {},
      paint: {
        'line-color': '#FFF',
        'line-offset': -2,
        'line-width': 10
      },
      filter: ['==', '$type', 'Polygon']
    }
  },
  {
    selectable: false,
    priority: 5,
    layer: {
      id: 'PolygonBlackShadow',
      type: 'line',
      source: undefined,
      layout: {},
      paint: {
        'line-color': '#551A8B',
        'line-opacity': 0.5,
        'line-offset': -6,
        'line-width': 2
      },
      filter: ['==', '$type', 'Polygon']
    }
  }
];
