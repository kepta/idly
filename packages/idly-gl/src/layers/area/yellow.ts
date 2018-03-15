import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';
export const yellowNatural = [
  'tag-natural-beach',
  'tag-natural-sand',
  'tag-natural-scrub',
];
export const yellowFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    ['==', `${IDLY_NS}tag-sport`, 'tag-sport-beachvolleyball'],
    ['in', `${IDLY_NS}tag-natural`, ...yellowNatural],
    [
      'in',
      `${IDLY_NS}tag-amenity`,
      'tag-amenity-childcare',
      'tag-amenity-kindergarten',
      'tag-amenity-school',
      'tag-amenity-college',
      'tag-amenity-university',
    ],
  ],
  // [
  //   'in',
  //   `${IDLY_NS}tagsClassType`,
  //   'tag-sport-beachvolleyball',
  //   'tag-natural-beach',
  //   'tag-natural-sand',
  //   'tag-natural-scrub',
  //   'tag-amenity-childcare',
  //   'tag-amenity-kindergarten',
  //   'tag-amenity-school',
  //   'tag-amenity-college',
  //   'tag-amenity-university',
  // ],
];

export default [
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaYellowLayer',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        ...areaTemplate.layer.paint,
        'line-color': '#ffff94',
      },
      filter: yellowFilter,
    },
  },
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaYellowLayerCasing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#ffff94' },
      filter: yellowFilter,
    },
  },
];
