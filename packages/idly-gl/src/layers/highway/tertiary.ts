import { fromJS } from 'immutable';

import { PLUGIN_NAME } from 'map/style';
import { fromJS } from 'map/utils/layerFactory';

const displayName = (sourceName: string) => sourceName + 'highwayTertiary';

export const highwayTertiary = (sourceName: string) => ({
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
      'line-color': '#FFF9B3',
      'line-opacity': 0.85,
      'line-width': 5
    },
    filter: fromJS([
      'all',
      [
        'in',
        `${PLUGIN_NAME}--tagsClassType`,
        'tag-highway-tertiary',
        'tag-highway-tertiary_link'
      ]
    ])
  })
});

const displayNameC = (sourceName: string) =>
  sourceName + 'highwayTertiaryCasing';

export const highwayTertiaryCasing = (sourceName: string) => ({
  displayName: displayNameC(sourceName),
  selectable: true,
  layer: fromJS({
    priority: -2,
    id: displayNameC(sourceName),
    type: 'line',
    source: sourceName,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#70372f',
      'line-opacity': 1,
      'line-width': 10
    },
    filter: fromJS([
      'all',
      [
        'in',
        `${PLUGIN_NAME}--tagsClassType`,
        'tag-highway-tertiary',
        'tag-highway-tertiary_link'
      ]
    ])
  })
});
