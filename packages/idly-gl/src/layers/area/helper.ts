import { PLUGIN_NAME } from '../../constants';

export const areaPaintStyle = {
  'line-color': '#551A8B',
  'line-width': {
    base: 4,
    stops: [[16, 4], [18, 40], [22, 20]]
  },
  'line-opacity': {
    base: 0.2,
    stops: [[16, 0.6], [18, 0.3], [22, 0.4]]
  },
  'line-offset': {
    base: 4,
    stops: [[16, 4], [18, 16], [22, 12]]
  },
  'line-blur': {
    base: 2,
    stops: [[16, 4], [18, 8], [22, 12]]
  }
};
