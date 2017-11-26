import { fromJS } from 'immutable';

import { PLUGIN_NAME } from 'map/style';
import { fromJS } from 'map/utils/layerFactory';

const displayName = (sourceName: string) => sourceName + 'highwayResidential';

export const highwayResidential = (sourceName: string) => ({
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
      'line-color': '#FFF',
      'line-opacity': 0.85,
      'line-width': 6
    },
    filter: fromJS([
      'all',
      [
        'in',
        `${PLUGIN_NAME}--tagsClassType`,
        'tag-highway-residential',
        'tag-highway-residential_link',
        'tag-highway-service'
      ]
    ])
  })
});
