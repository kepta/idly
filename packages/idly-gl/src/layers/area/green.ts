import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';
import { blueLanduse, blueNatural } from './blue';
import { goldLanduse } from './gold';
import { grayLanduse, grayNatural, graySport } from './gray';
import { lightGreenLanduse } from './lightGreen';
import { orangeLanduse } from './orange';
import { pinkLanduse } from './pink';
import { tanLanduse } from './tan';
import { yellowNatural } from './yellow';

export const greenFilter = [
  'any',
  [
    'all',
    ['has', `${IDLY_NS}tag-natural`],
    [
      '!in',
      `${IDLY_NS}tag-natural`,
      ...yellowNatural,
      ...blueNatural,
      ...grayNatural,
    ],
  ],
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
    'tag-leisure-park',
  ],
  [
    // leisure park http://localhost:8080/#17.69/40.728129/-73.979866
    'all',
    ['==', `${IDLY_NS}tag-leisure`, 'tag-leisure-pitch'],
    ['!in', `${IDLY_NS}tag-sport`, ...graySport],
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

      id: 'area-green-layer',
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
      id: 'area-green-layer-casing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#8cd05f' },
      filter: greenFilter,
    },
  },
];
