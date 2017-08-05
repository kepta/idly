import { FillLayer } from 'map/layers/area';
import { LineLayer } from 'map/layers/line';
import { PointsWithLabels } from 'map/layers/pointsWithLabels';
import { PointsWithoutLabels } from 'map/layers/pointsWithoutLabel';

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
  PointsWithLabels,
  PointsWithoutLabels,
  LineLayer,
  FillLayer
};

export const SELECTABLE_LAYERS = Object.keys(Layers)
  .filter(l => Layers[l].selectable)
  .map(l => SOURCES.map(s => s.source + Layers[l].displayName))
  .reduce((prv, c) => prv.concat(c), []);

export const LAYERS = Object.keys(Layers)
  .map(l => SOURCES.map(s => s.source + Layers[l].displayName))
  .reduce((prv, c) => prv.concat(c), []);
