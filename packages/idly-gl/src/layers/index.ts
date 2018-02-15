import area from './area';
import areaLabels from './areaLabels';
import highway from './highway';
import line from './line';
import lineLabel from './lineLabel';
import pointsDraggable from './pointsDraggable';
import pointsWithLabels from './pointsWithLabels';
import pointsWithoutLabels from './pointsWithoutLabel';
import rail from './rail';
import waterway from './waterway';

const layers = [
  ...area,
  ...highway,
  ...rail,
  ...waterway,
  ...areaLabels,
  // ...line,
  ...lineLabel,
  ...pointsWithLabels,
  ...pointsWithoutLabels,
  ...pointsDraggable,
].sort((a, b) => a.priority - b.priority);
export default layers;

if (layers.some(r => !(r.priority < 10 && r.priority >= 0))) {
  throw new Error('priority must be 0 <= p < 10');
}
