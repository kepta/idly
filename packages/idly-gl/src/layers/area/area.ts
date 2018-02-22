import { IDLY_NS } from '../../constants';
import { areaPaintStyle } from './helper';

export default [
  {
    selectable: false,
    priority: 0.1,
    layer: {
      id: 'AreaLayer',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#551A8B',
        'line-width': 2,
        'line-opacity': 1,
      },
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
      id: 'AreaLayerCasing',
      type: 'line',
      source: undefined,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: areaPaintStyle,
      filter: [
        'all',
        ['==', '$type', 'Polygon'],
        ['!=', `${IDLY_NS}tagsClass`, 'tag-building'],
      ],
    },
  },
];
