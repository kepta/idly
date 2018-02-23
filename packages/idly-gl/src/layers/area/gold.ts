import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const goldFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  /**
   * @TOFIX need to figure out for `tagsClass` and let the ``${IDLY_NS}tagsClassType`` override
   *  based on priority.
   */
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-landuse-residential',
    'tag-landuse-construction',
  ],
];

export default [
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaGoldLayer',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        ...areaTemplate.layer.paint,
        'line-color': '#c4bd19',
      },
      filter: goldFilter,
    },
  },
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaGoldLayerCasing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#c4bd19' },
      filter: goldFilter,
    },
  },
];
