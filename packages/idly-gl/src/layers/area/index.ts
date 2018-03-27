import { Layer } from '../types';
import area from './areaFallback';
import blue from './blue';
import building from './building';
import gold from './gold';
import gray from './gray';
import green from './green';
import lightGreen from './lightGreen';
import orange from './orange';
import pink from './pink';
import tan from './tan';
import yellow from './yellow';

const layers: Layer[] = [
  ...area,
  ...blue,
  ...building,
  ...gold,
  ...gray,
  ...green,
  ...lightGreen,
  ...orange,
  ...pink,
  ...tan,
  ...yellow,
];

export default layers;
