import { areaPaintStyle } from './helper';
import { PLUGIN_NAME } from '../../constants';

const filter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${PLUGIN_NAME}--tagsClassType`,
    'tag-sport-beachvolleyball',
    'tag-natural-beach',
    'tag-natural-sand',
    'tag-natural-scrub',
    'tag-amenity-childcare',
    'tag-amenity-kindergarten',
    'tag-amenity-school',
    'tag-amenity-college',
    'tag-amenity-university'
  ]
];

export default [
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaYellowLayer',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffff94',
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
      id: 'areaYellowLayerCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: { ...areaPaintStyle, 'line-color': '#ffff94' },
      filter
    }
  }
];
