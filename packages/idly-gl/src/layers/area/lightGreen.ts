import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

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
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaLightGreenLayer',
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
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaLightGreenLayerCasing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#c7d3a0' },
      filter: lightGreenFilter,
    },
  },
];
