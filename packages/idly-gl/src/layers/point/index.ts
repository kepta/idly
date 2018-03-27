import { Layer } from '../types';
import intersections from './intersections';
import points from './points';

const layers: Layer[] = [...intersections, ...points];

export default layers;
