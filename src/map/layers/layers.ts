import { SOURCES } from 'map/constants';
import { AreaLayer } from 'map/layers/area';
import { AreaLabelsLayer } from 'map/layers/areaLabels';
import { LineLayer } from 'map/layers/line';
import { LineLabelLayer } from 'map/layers/lineLabel';
import { PointsWithLabelsLayer } from 'map/layers/pointsWithLabels';
import { PointsWithoutLabelsLayer } from 'map/layers/pointsWithoutLabel';

const source = SOURCES.map(s => s.source);

export const Layers = [
  AreaLayer,
  LineLayer,
  LineLabelLayer,
  PointsWithLabelsLayer,
  AreaLabelsLayer,
  PointsWithoutLabelsLayer
];

export const SourceLayered = SOURCES.map(s => Layers.map(l => l(s.source))); // flatten the array

export const SELECTABLE_LAYERS = SourceLayered.reduce(
  (prv, c) => prv.concat(c),
  []
)
  .filter(l => l.selectable)
  .map(l => l.displayName);
console.log(SELECTABLE_LAYERS);
export const LAYERS = SourceLayered.reduce((prv, c) => prv.concat(c), []).map(
  l => l.displayName
);
