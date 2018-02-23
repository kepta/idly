import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';
import { blueFilter } from './blue';
import { goldFilter } from './gold';
import { grayFilter } from './gray';
import { lightGreenFilter } from './lightGreen';
import { orangeFilter } from './orange';
import { pinkFilter } from './pink';
import { tanFilter } from './tan';
import { yellowFilter } from './yellow';

export const greenFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    /**
     * @TOFIX doesnt work for a way, I guess a !area, with tag natural=coastline
     */
    ['in', `${IDLY_NS}tagsClass`, 'tag-natural', 'tag-landuse'],
    [
      'in',
      `${IDLY_NS}tagsClassType`,
      'tag-leisure-nature_reserve',
      'tag-leisure-pitch',
      'tag-leisure-park',
      'tag-landuse-forest',
      'tag-natural-wetland',
    ],
  ],
  ['none', goldFilter],
  ['none', blueFilter],
  ['none', grayFilter],
  ['none', yellowFilter],
  ['none', lightGreenFilter],
  ['none', orangeFilter],
  ['none', pinkFilter],
  ['none', tanFilter],
];

export default [
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      /**
       * @TOFIX due to tag-landuse .
       *  need to standardized priority
       */

      id: 'areaGreenLayer',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        ...areaTemplate.layer.paint,
        'line-color': '#8cd05f',
      },
      filter: greenFilter,
    },
  },
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaGreenLayerCasing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#8cd05f' },
      filter: greenFilter,
    },
  },
];
