import { PLUGIN_NAME } from '../../constants';
import { areaPaintStyle } from './helper';

const filter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${PLUGIN_NAME}--tagsClassType`,
    'tag-amenity-parking',
    'tag-leisure-pitch.tag-sport-basketball',
    'tag-leisure-pitch.tag-sport-skateboard',
    'tag-natural-bare_rock',
    'tag-natural-scree',
    'tag-landuse-railway',
    'tag-landuse-quarry',
    'tag-natural-cave_entrance',
    'tag-natural-glacier'
  ]
];

export default [
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaGrayLayer',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#bbb',
        'line-width': 2,
        'line-opacity': 1
      },
      filter
    }
  },
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaGrayLayerCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: { ...areaPaintStyle, 'line-color': '#bbb' },
      filter
    }
  }
];
