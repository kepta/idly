import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

// cemetry http://localhost:8080/#19.41/40.7245054/-73.9887333
export const lightGreenLanduse = [
  'tag-landuse-cemetery',
  'tag-landuse-orchard',
  'tag-landuse-meadow',
  'tag-landuse-farm',
  'tag-landuse-farmland',
];
export const lightGreenFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  ['in', `${IDLY_NS}tag-landuse`, ...lightGreenLanduse],
];

export default [
  {
    selectable: true,
    priority: AREA.ZERO,
    layer: {
      id: 'area-light-green',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        ...areaTemplate.layer.paint,
        'line-color': '#c7d3a0',
      },
      filter: lightGreenFilter,
    },
  },
  {
    selectable: true,
    priority: AREA.ZERO,
    layer: {
      id: 'area-light-green-casing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#c7d3a0' },
      filter: lightGreenFilter,
    },
  },
];
