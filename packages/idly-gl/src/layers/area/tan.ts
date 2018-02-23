// tag-landuse-farmyard
import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const tanFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  ['in', `${IDLY_NS}tagsClassType`, 'tag-landuse-farmyard'],
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
