import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const orangeFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-landuse-retail',
    'tag-landuse-commercial',
    'tag-landuse-landfill',
    'tag-military',
    'tag-landuse-military',
  ],
];

export default [
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaOrangeLayer',
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
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaOrangeLayerCasing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#d6881a' },
      filter: orangeFilter,
    },
  },
];
