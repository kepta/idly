import { IDLY_NS } from '../../constants';
import { NON_INTERACTIVE } from '../priorities';

export default [
  {
    selectable: false,
    priority: NON_INTERACTIVE.ZERO,
    layer: {
      id: 'nonInteractiveOnewayArrow',
      type: 'symbol',
      source: undefined,
      layout: {
        'icon-size': 0.75,
        'icon-image': 'triangle-11',
        'icon-rotate': 90,
        'icon-padding': 2,
        'symbol-spacing': 38,
        'symbol-placement': 'line',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        ['==', `${IDLY_NS}isOneway`, true],
      ],
    },
  },
];
