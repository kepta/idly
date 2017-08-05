export const ZOOM = 16;
export const SOURCES = [
  {
    source: 'virgin',
    data: 'entities'
  },
  {
    source: 'modified',
    data: 'modifiedEntities'
  }
];

export const Layers = {
  PointsWithLabels: 'PointsWithLabels',
  PointsWithoutLabels: 'PointsWithoutLabels',
  LineLayer: 'LineLayer'
};

export const LAYERS = Object.keys(Layers)
  .map(l => SOURCES.map(s => s.source + Layers[l]))
  .reduce((prv, c) => prv.concat(c), []);
