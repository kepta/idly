import area from './area';
import highway from './highway';
import rail from './rail';
import waterway from './waterway';
import areaLabels from './areaLabels';
import line from './line';
import lineLabel from './lineLabel';
import pointsWithLabels from './pointsWithLabels';
import pointsWithoutLabels from './pointsWithoutLabel';

export default [
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
