export default [
  {
    selectable: true,
    priority: 1,
    layer: {
      id: 'LineLayer',
      source: undefined,
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#eee',
        'line-width': 2
      },
      filter: ['all', ['==', '$type', 'LineString']]
    }
  }
];
