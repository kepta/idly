// tag-landuse-farmyard
import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const tanLanduse = ['tag-landuse-farmyard'];

export const tanFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  ['==', `${IDLY_NS}tag-landuse`, tanLanduse[0]],
];

export default [
  {
    selectable: true,
    priority: AREA.ZERO,
    layer: {
      id: 'area-tan',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        ...areaTemplate.layer.paint,
        'line-color': '#f5dcba',
      },
      filter: tanFilter,
    },
  },
  {
    selectable: true,
    priority: AREA.ZERO,
    layer: {
      id: 'area-tan-casing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#f5dcba' },
      filter: tanFilter,
    },
  },
];
