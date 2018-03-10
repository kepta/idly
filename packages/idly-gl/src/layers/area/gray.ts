import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const grayLanduse = ['tag-landuse-railway', 'tag-landuse-quarry'];
export const grayFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    ['==', `${IDLY_NS}tag-amenity`, 'tag-amenity-parking'],
    [
      // need to check
      'all',
      ['==', `${IDLY_NS}tag-leisure`, 'tag-leisure-pitch'],
      [
        'in',
        `${IDLY_NS}tag-sport`,
        'tag-sport-basketball',
        'tag-sport-skateboard',
      ],
    ],
    ['in', `${IDLY_NS}tag-landuse`, ...grayLanduse],
    [
      'in',
      `${IDLY_NS}tag-natural`,
      'tag-natural-bare_rock',
      'tag-natural-scree',
      'tag-natural-cave_entrance',
      'tag-natural-glacier',
    ],
    // [
    //   'in',
    //   `${IDLY_NS}tagsClassType`,
    //   'tag-amenity-parking',
    //   'tag-leisure-pitch.tag-sport-basketball',
    //   'tag-leisure-pitch.tag-sport-skateboard',
    //   'tag-landuse-railway',
    //   'tag-landuse-quarry',
    //   'tag-natural-bare_rock',
    //   'tag-natural-scree',
    //   'tag-natural-cave_entrance',
    //   'tag-natural-glacier',
    // ],
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
