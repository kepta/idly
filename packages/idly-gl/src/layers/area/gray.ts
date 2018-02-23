import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const grayFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-amenity-parking',
    'tag-leisure-pitch.tag-sport-basketball',
    'tag-leisure-pitch.tag-sport-skateboard',
    'tag-natural-bare_rock',
    'tag-natural-scree',
    'tag-landuse-railway',
    'tag-landuse-quarry',
    'tag-natural-cave_entrance',
    'tag-natural-glacier',
  ],
];

export default [
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaGrayLayer',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        ...areaTemplate.layer.paint,
        'line-color': '#bbb',
      },
      filter: grayFilter,
    },
  },
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaGrayLayerCasing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#bbb' },
      filter: grayFilter,
    },
  },
];
