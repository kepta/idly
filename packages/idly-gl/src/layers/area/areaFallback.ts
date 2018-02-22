import { IDLY_NS } from '../../constants';
import { areaCasingTemplate, areaTemplate } from './area.template';
import { areaPaintStyle } from './helper';

export default [
  {
    selectable: false,
    priority: 0.1,
    layer: {
      id: 'AreaFallbackLayer',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: areaTemplate.layer.paint,
      filter: [
        'all',
        ['==', '$type', 'Polygon'],
        /**
         * @REVISIT buildings or any small really look ugly with that gl offset artifact
         *  going for a fill layer for now.
         */
        ['!=', `${IDLY_NS}tagsClass`, 'tag-building'],
      ],
    },
  },
  {
    selectable: false,
    priority: 0.1,
    layer: {
      id: 'AreaFallbackLayerCasing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: areaCasingTemplate.layer.paint,
      filter: [
        'all',
        ['==', '$type', 'Polygon'],
        ['!=', `${IDLY_NS}tagsClass`, 'tag-building'],
      ],
    },
  },
];
