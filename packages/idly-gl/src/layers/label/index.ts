import { Layer } from '../types';
import areaLabels from './areaLabels';
import lineLabel from './lineLabel';
import pointsWithLabels from './pointsWithLabels';

const layers: Layer[] = [...areaLabels, ...lineLabel, ...pointsWithLabels];

export default layers;
