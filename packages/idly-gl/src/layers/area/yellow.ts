import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const yellowFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-sport-beachvolleyball',
    'tag-natural-beach',
    'tag-natural-sand',
    'tag-natural-scrub',
    'tag-amenity-childcare',
    'tag-amenity-kindergarten',
    'tag-amenity-school',
    'tag-amenity-college',
    'tag-amenity-university',
  ],
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
