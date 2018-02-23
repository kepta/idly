import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const pinkFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-landuse-industrial',
    'tag-power-plant',
  ],
];

export default [
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaPinkLayer',
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
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaPinkLayerCasing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#e4a4f5' },
      filter: pinkFilter,
    },
  },
];
