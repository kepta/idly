import { fromJS } from 'immutable';

import { PLUGIN_NAME } from '../layers/style';
import { fromJS } from '../layers/utils/layerFactory';

const displayName = (sourceName: string) => sourceName + 'waterway';

export const waterway = (sourceName: string) => ({
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
      'line-color': '#77d3de',
      'line-opacity': 0.85,
      'line-width': 5
    },
    filter: fromJS(['all', ['in', `${PLUGIN_NAME}--tagsClass`, 'tag-waterway']])
  })
});
