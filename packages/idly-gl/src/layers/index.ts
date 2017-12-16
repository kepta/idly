import area from './area';
import highway from './highway';
import rail from './rail';
import waterway from './waterway';
import areaLabels from './areaLabels';
import line from './line';
import lineLabel from './lineLabel';
import pointsWithLabels from './pointsWithLabels';
import pointsWithoutLabels from './pointsWithoutLabel';

const layers = [
  ...area,
  ...highway,
  ...rail,
  ...waterway,
  ...areaLabels,
  ...line,
  ...lineLabel,
  ...pointsWithLabels,
  ...pointsWithoutLabels
];
export default layers;

if (layers.some(r => !(r.priority < 10 && r.priority >= 0))) {
  throw new Error('priority must be 0 <= p < 10');
}
