import { fromJS } from 'immutable';

import { fromJS } from '../layers/utils/layerFactory';

const displayName = (sourceName: string) => sourceName + 'LineLayer';

export const LineLayer = (sourceName: string) => ({
  displayName: displayName(sourceName),
  selectable: true,
  layer: fromJS({
    id: displayName(sourceName),
    type: 'line',
    source: sourceName,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#eee',
      'line-width': 2
    },
    filter: fromJS(['all', ['==', '$type', 'LineString']])
  })
});
