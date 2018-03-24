import { IDLY_NS } from '../../constants';
import { HIGHWAY, WATERWAY } from '../priorities';

export default [
  {
    selectable: true,
    priority: WATERWAY.MINUS_1,
    layer: {
      id: 'PlaceHolderLayer1',
      source: undefined,
      type: 'line',
      layout: {},
      paint: {},
      filter: ['all', ['boolean', false]],
    },
  },
  {
    selectable: true,
    priority: WATERWAY.MINUS_2,
    layer: {
      id: 'PlaceHolderLayer2',
      source: undefined,
      type: 'line',
      layout: {},
      paint: {},
      filter: ['all', ['boolean', false]],
    },
  },
  {
    selectable: true,
    priority: WATERWAY.MINUS_3,
    layer: {
      id: 'PlaceHolderLayer3',
      source: undefined,
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {},
      filter: ['all', ['boolean', false]],
    },
  },
];
