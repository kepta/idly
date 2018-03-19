import area from './area';
import extrusion from './extrusion/extrusion';
import highway from './highway';
import pointsDraggable from './interactive/pointsDraggable';
import areaLabels from './label/areaLabels';
import lineLabel from './label/lineLabel';
import pointsWithLabels from './label/pointsWithLabels';
import onewayArrows from './nonInteractive/onewayArrows';
import intersections from './point/intersections';
import pointsWithoutLabels from './point/points';
import rail from './rail';
import waterway from './waterway';

const layers = [
  ...area,
  ...extrusion,
  ...highway,
  ...rail,
  ...waterway,
  ...areaLabels,
  ...onewayArrows,
  ...lineLabel,
  ...pointsWithLabels,
  ...pointsWithoutLabels,
  ...intersections,
  ...pointsDraggable,
]
  .filter(r => !r.hide)
  .sort((a, b) => a.priority - b.priority);

export default layers;

if (layers.some(r => !(r.priority < 10 && r.priority >= 0))) {
  throw new Error('priority must be 0 <= p < 10');
}
