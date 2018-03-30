import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const orangeLanduse = [
  'tag-landuse-retail',
  'tag-landuse-commercial',
  'tag-landuse-landfill',
  'tag-landuse-military',
];
export const orangeFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    ['in', `${IDLY_NS}tag-landuse`, ...orangeLanduse],
    ['has', `${IDLY_NS}tag-military`],
    // 'in',
    // `${IDLY_NS}tagsClassType`,
    // 'tag-landuse-retail',
    // 'tag-landuse-commercial',
    // 'tag-landuse-landfill',
    // 'tag-landuse-military',
    // 'tag-military',
  ],
];

export default [
  {
    selectable: true,
    priority: AREA.ZERO,
    layer: {
      id: 'area-orange',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        ...areaTemplate.layer.paint,
        'line-color': '#d6881a',
      },
      filter: orangeFilter,
    },
  },
  {
    selectable: true,
    priority: AREA.ZERO,
    layer: {
      id: 'area-orange-casing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#d6881a' },
      filter: orangeFilter,
    },
  },
];
