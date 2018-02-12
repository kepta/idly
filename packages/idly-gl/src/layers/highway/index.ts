import motorway from './motorway';
import narrow from './narrow';
import primary from './primary';
import residential from './residential';
import secondary from './secondary';
import tertiary from './tertiary';
import trunk from './trunk';
import unclassified from './unclassified';

export default [
  ...motorway,
  ...narrow,
  ...primary,
  ...residential,
  ...secondary,
  ...tertiary,
  ...trunk,
  ...unclassified,
].map(r => {
  r.layer.paint['line-width'] = [
    'interpolate',
    ['exponential', 2],
    ['zoom'],
    14,
    4,
    20,
    12,
  ];
  return r;
});
