import { fromJS } from 'immutable';

import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';
import { PLUGIN_NAME } from 'map/style';

const displayName = (sourceName: string) => sourceName + 'highwayResidential';

export const highwayResidential = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayName(sourceName),
    selectable: true,
    layer: LayerSpec({
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
          `${PLUGIN_NAME}.tagsClassType`,
          'tag-highway-residential',
          'tag-highway-residential_link',
          'tag-highway-service'
        ]
      ])
    })
  });
