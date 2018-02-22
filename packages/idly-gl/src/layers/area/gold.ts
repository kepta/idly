import { IDLY_NS } from '../../constants';
import { areaPaintStyle } from './helper';

const filter = [
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
    priority: 1,
    layer: {
      id: 'areaGoldLayer',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#c4bd19',
        'line-width': 2,
        'line-opacity': 1,
      },
      filter,
    },
  },
  {
    selectable: false,
    priority: 1,
    layer: {
      id: 'areaGoldLayerCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: { ...areaPaintStyle, 'line-color': '#c4bd19' },
      filter,
    },
  },
];
