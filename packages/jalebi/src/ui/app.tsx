import * as React from 'react';
import { Map } from './map/index';
import { Presets } from './presets';
export class App extends React.PureComponent {
  public render() {
    return null;
  }
}

const feat = {
  geometry: {
    type: 'LineString',
    coordinates: [
      [-74.00884620845318, 40.71380563464672],
      [-74.01008605957031, 40.71436421368358],
    ],
  },
  type: 'Feature',
  properties: {
    'osm_basic--name': 'Murray Street',
    'osm_basic--icon': 'highway-secondary',
    'osm_basic--geometry': 'line',
    'osm_basic--tagsClass': 'tag-highway',
    'osm_basic--tagsClassType': 'tag-highway-secondary',
    id: 'w222299272',
  },
  layer: {
    id: 'idly-gl-base-src-1-LineLabelLayer',
    type: 'symbol',
    source: 'idly-gl-base-src-1',
    filter: ['all', ['==', '$type', 'LineString']],
    layout: {
      'symbol-placement': 'line',
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-field': '{osm_basic--name}',
      'text-size': 12,
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.05,
      'text-optional': true,
      'text-allow-overlap': false,
    },
    paint: {
      'text-halo-color': '#ffffff',
      'text-halo-width': 1.5,
      'text-halo-blur': 0.5,
    },
  },
};
