import { HighlightColor } from 'idly-common/lib/styling/highlight';
import { IDLY_NS } from '../../constants';
import { highwayTemplate, makeLineWidth } from '../highway/highway.template';
import { LOWEST_PRIORITY } from '../priorities';

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
        'line-width': makeLineWidth(5.5),
      },
      filter: [
        'all',
        ['==', `${IDLY_NS}relation-type`, 'turn-restriction'],
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
        'circle-radius': 20,
        'circle-color': HighlightColor.KIND_UNIMPORTANT,
        'circle-opacity': 0.5,
      },
      filter: [
        'all',
        ['==', `${IDLY_NS}relation-type`, 'turn-restriction'],
        ['==', `${IDLY_NS}geometry`, 'vertex'],
      ],
    },
  },
];

// '@idly-relation-type': 'turn-restriction',
