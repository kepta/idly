import { fromJS } from 'immutable';

import { PLUGIN_NAME } from '../layers/style';
import { fromJS } from '../layers/utils/layerFactory';

const displayName = (sourceName: string) => sourceName + 'railway';

export const railway = (sourceName: string) => ({
  displayName: displayName(sourceName),
  selectable: true,
  layer: fromJS({
    priority: 2,
    id: displayName(sourceName),
    type: 'line',
    source: sourceName,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#555',
      'line-opacity': 0.85,
      'line-width': 5
    },
    filter: fromJS(['all', ['in', `${PLUGIN_NAME}--tagsClass`, 'tag-railway']])
  })
});

const displayNameC = (sourceName: string) => sourceName + 'railwayCasing';

export const railwayCasing = (sourceName: string) => ({
  displayName: displayNameC(sourceName),
  selectable: true,
  layer: fromJS({
    priority: 2.5,
    id: displayNameC(sourceName),
    type: 'line',
    source: sourceName,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#eee',
      'line-opacity': 0.85,
      'line-width': 3,
      'line-dasharray': [1, 4]
    },
    filter: fromJS(['all', ['in', `${PLUGIN_NAME}--tagsClass`, 'tag-railway']])
  })
});
