import { fromJS } from 'immutable';

import { PLUGIN_NAME } from '../../layers/style';

const displayName = (sourceName: string) => sourceName + 'highwayPrimary';

export const highwayPrimary = (sourceName: string) => ({
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
      'line-color': '#F99806',
      'line-opacity': 1,
      'line-width': 6
    },
    filter: fromJS([
      'all',
      [
        'in',
        `${PLUGIN_NAME}--tagsClassType`,
        'tag-highway-primary',
        'tag-highway-primary_link'
      ]
    ])
  })
});
