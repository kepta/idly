import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const goldLanduse = [
  'tag-landuse-residential',
  'tag-landuse-construction',
];
export const goldFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  /**
   * @TOFIX need to figure out for `tagsClass` and let the ``${IDLY_NS}tagsClassType`` override
   *  based on priority.
   */
  ['in', `${IDLY_NS}tag-landuse`, ...goldLanduse],
];

export default [
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'area-gold-layer',
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
      id: 'area-gold-layer-casing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#c4bd19' },
      filter: goldFilter,
    },
  },
];
