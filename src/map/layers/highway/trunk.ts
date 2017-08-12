import { fromJS } from 'immutable';

import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

const displayName = (sourceName: string) => sourceName + 'highwayTrunk';

export const highwayTrunk = (sourceName: string) =>
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
        'line-color': '#DD2F22',
        'line-opacity': 0.85,
        'line-width': {
          base: 1.2,
          stops: [[5, 0.4], [6, 0.7], [7, 1.75], [20, 16]]
        }
      },
      filter: fromJS([
        'all',
        ['in', 'tagsClassType', 'tag-highway-trunk', 'tag-highway-trunk_link']
      ])
    })
  });
