import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export default [
  {
    selectable: true,
    priority: AREA.MINUS_1,
    layer: {
      id: 'area-fallback-layer',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        'line-color': 'white',
        'line-width': 1,
      },
      filter: [
        'all',
        ['==', `${IDLY_NS}geometry`, 'area'],
        /**
         * @REVISIT buildings or any small really look ugly with that gl offset artifact
         *  going for a fill layer for now.
         */
        ['!has', `${IDLY_NS}tag-building`],
      ],
    },
  },
  {
    selectable: true,
    priority: AREA.MINUS_2,
    layer: {
      id: 'area-fallback-layer-casing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: {
        'line-color': 'white',
        'line-width': 1,
      },
      filter: [
        'all',
        // ['==', '$type', 'Polygon'],
        ['==', `${IDLY_NS}geometry`, 'area'],
        ['!has', `${IDLY_NS}tag-building`],
      ],
    },
  },
];
