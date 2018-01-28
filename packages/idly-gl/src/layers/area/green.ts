import { PLUGIN_NAME } from '../../constants';
import { areaPaintStyle } from './helper';

const filter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    /**
     * @TOFIX doesnt work for a way, I guess a !area, with tag natural=coastline
     */
    ['in', `${PLUGIN_NAME}--tagsClass`, 'tag-natural', 'tag-landuse'],
    [
      'in',
      `${PLUGIN_NAME}--tagsClassType`,
      'tag-leisure-nature_reserve',
      'tag-leisure-pitch',
      'tag-leisure-park',
      'tag-landuse-forest',
      'tag-natural-wetland'
    ]
  ]
];

export default [
  {
    selectable: false,
    priority: 0.9,
    layer: {
      /**
       * @TOFIX due to tag-landuse .
       *  need to standardized priority
       */

      id: 'areaGreenLayer',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#8cd05f',
        'line-width': 2,
        'line-opacity': 1
      },
      filter
    }
  },
  {
    selectable: false,
    priority: 0.9,
    layer: {
      id: 'areaGreenLayerCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: { ...areaPaintStyle, 'line-color': '#8cd05f' },
      filter
    }
  }
];
