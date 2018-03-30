import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const pinkLanduse = ['tag-landuse-industrial'];
export const pinkFilter = [
  'all',
  ['==', '$type', 'Polygon'],

  [
    'any',
    ['==', `${IDLY_NS}tag-landuse`, pinkLanduse[0]],
    ['==', `${IDLY_NS}tag-power`, 'tag-power-plant'],
    // 'in',
    // `${IDLY_NS}tagsClassType`,
    // 'tag-landuse-industrial',
    // 'tag-power-plant',
  ],
];

export default [
  {
    selectable: true,
    priority: AREA.ZERO,
    layer: {
      id: 'area-pink',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        ...areaTemplate.layer.paint,
        'line-color': '#e4a4f5',
      },
      filter: pinkFilter,
    },
  },
  {
    selectable: true,
    priority: AREA.ZERO,
    layer: {
      id: 'area-pink-casing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#e4a4f5' },
      filter: pinkFilter,
    },
  },
];
