import { fromJS } from 'immutable';

import { PLUGIN_NAME } from 'map/style';
import { fromJS } from 'map/utils/layerFactory';

const displayNameTrack = (sourceName: string) => sourceName + 'highwayTrack';

export const highwayTrack = (sourceName: string) => ({
  displayName: displayNameTrack(sourceName),
  selectable: true,
  layer: fromJS({
    priority: 2,
    id: displayNameTrack(sourceName),
    type: 'line',
    source: sourceName,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#c5b59f',
      'line-opacity': 1,
      'line-width': 4
    },
    filter: fromJS([
      'all',
      ['in', `${PLUGIN_NAME}--tagsClassType`, 'tag-highway-track']
    ])
  })
});

const displayNameNarrow = (sourceName: string) => sourceName + 'highwayNarrow';

export const highwayNarrow = (sourceName: string) => ({
  displayName: displayNameNarrow(sourceName),
  selectable: true,
  layer: fromJS({
    priority: 2,
    id: displayNameNarrow(sourceName),
    type: 'line',
    source: sourceName,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#c5b59f',
      'line-opacity': 0.7,
      'line-width': 5
    },
    filter: fromJS([
      'all',
      [
        'in',
        `${PLUGIN_NAME}--tagsClassType`,
        'tag-highway-path',
        'tag-highway-footway',
        'tag-highway-bridleway',
        'tag-highway-cycleway'
      ]
    ])
  })
});

const displayNameC = (sourceName: string) => sourceName + 'highwayNarrowCasing';

export const highwayNarrowCasing = (sourceName: string) => ({
  displayName: displayNameC(sourceName),
  selectable: false,
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
      'line-color': '#FFF',
      'line-opacity': 1,
      'line-width': {
        base: 1,
        stops: [[8, 3], [12, 5]]
      },
      'line-dasharray': [0.4, 2]
    },
    filter: fromJS([
      'all',
      [
        'in',
        `${PLUGIN_NAME}--tagsClassType`,
        'tag-highway-path',
        'tag-highway-footway',
        'tag-highway-bridleway',
        'tag-highway-cycleway'
      ]
    ])
  })
});
