import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';
import { blueFilter, blueLanduse } from './blue';
import { goldFilter, goldLanduse } from './gold';
import { grayFilter, grayLanduse } from './gray';
import { lightGreenFilter, lightGreenLanduse } from './lightGreen';
import { orangeFilter, orangeLanduse } from './orange';
import { pinkFilter, pinkLanduse } from './pink';
import { tanFilter, tanLanduse } from './tan';
import { yellowFilter } from './yellow';

export const greenFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    /**
     * @TOFIX doesnt work for a way, I guess a !area, with tag natural=coastline
     */
    // ['in', `${IDLY_NS}tagsClass`, 'tag-natural', 'tag-landuse'],
    ['has', `${IDLY_NS}tag-natural`],
    [
      'all',
      ['has', `${IDLY_NS}tag-landuse`],
      [
        '!in',
        `${IDLY_NS}tag-landuse`,
        ...blueLanduse,
        ...goldLanduse,
        ...grayLanduse,
        ...lightGreenLanduse,
        ...orangeLanduse,
        ...pinkLanduse,
        ...tanLanduse,
      ],
    ],
    [
      'in',
      `${IDLY_NS}tag-leisure`,
      'tag-leisure-nature_reserve',
      'tag-leisure-pitch',
      'tag-leisure-park',
    ],
  ],
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
