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
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaTanLayer',
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
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaTanLayerCasing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#f5dcba' },
      filter: tanFilter,
    },
  },
];
