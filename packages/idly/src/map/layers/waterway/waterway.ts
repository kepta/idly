import { fromJS } from 'immutable';

import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';
import { PLUGIN_NAME } from 'map/style';

const displayName = (sourceName: string) => sourceName + 'waterway';

export const waterway = (sourceName: string) =>
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
        'line-color': '#77d3de',
        'line-opacity': 0.85,
        'line-width': 5
      },
      filter: fromJS([
        'all',
        ['in', `${PLUGIN_NAME}.tagsClass`, 'tag-waterway']
      ])
    })
  });

// const displayNameC = (sourceName: string) => sourceName + 'railwayCasing';

// export const railwayCasing = (sourceName: string) =>
//   simpleLayerHOC({
//     displayName: displayNameC(sourceName),
//     selectable: true,
//     layer: LayerSpec({
//       priority: 2.5,
//       id: displayNameC(sourceName),
//       type: 'line',
//       source: sourceName,
//       layout: {
//         'line-join': 'round',
//         'line-cap': 'round'
//       },
//       paint: {
//         'line-color': '#eee',
//         'line-opacity': 0.85,
//         'line-width': 3,
//         'line-dasharray': [1, 4]
//       },
//       filter: fromJS(['all', ['in', `${PLUGIN_NAME}.tagsClass`, 'tag-waterway']])
//     })
//   });
