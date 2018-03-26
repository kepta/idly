import { HighlightColor } from 'idly-common/lib/styling/highlight';
import { IDLY_NS } from '../../constants';
import { highwayTemplate, makeLineWidth } from '../highway/highway.template';
import { LOWEST_PRIORITY } from '../priorities';

const filter = ['all', ['has', `${IDLY_NS}turn-restriction`]];

export default [
  {
    selectable: true,
    priority: LOWEST_PRIORITY,
    layer: {
      id: 'relations-turn-restriction-way',
      type: 'line',
      minzoom: 17,
      source: undefined,
      layout: highwayTemplate.layer.layout,
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': HighlightColor.KIND_UNIMPORTANT,
        'line-opacity': 0.4,
        'line-width': makeLineWidth(4),
      },
      filter: [
        'all',
        ['has', `${IDLY_NS}turn-restriction`],
        ['==', `${IDLY_NS}geometry`, 'line'],
      ],
    },
  },
  {
    selectable: true,
    priority: LOWEST_PRIORITY,
    layer: {
      minzoom: 17,
      id: 'relations-turn-restriction-node',
      source: undefined,
      type: 'circle',
      layout: {},
      paint: {
        'circle-radius': 15,
        'circle-color': HighlightColor.KIND_UNIMPORTANT,
        'circle-opacity': 0.5,
      },
      filter: [
        'all',
        ['has', `${IDLY_NS}turn-restriction`],
        ['==', `${IDLY_NS}geometry`, 'vertex'],
      ],
    },
  },
];
