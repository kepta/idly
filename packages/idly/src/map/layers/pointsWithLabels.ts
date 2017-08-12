import { fromJS } from 'immutable';

import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';
import { SymbolLayout, SymbolPaint } from 'mapbox-gl';
import { Geometry } from 'osm/entities/constants';

const displayName = (sourceName: string) =>
  sourceName + 'PointsWithLabelsLayer';

export const PointsWithLabelsLayer = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayName(sourceName),
    selectable: true,
    layer: LayerSpec({
      minzoom: 17,
      priority: 3,
      id: displayName(sourceName),
      type: 'symbol',
      source: sourceName,
      layout: {
        'icon-image': '{icon}-11',
        'icon-allow-overlap': true,
        'text-field': '{name}',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 9,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.05,
        'text-offset': [0, 1.5],
        'text-optional': true,
        'text-anchor': 'top',
        'text-allow-overlap': false
      } as SymbolLayout,
      paint: {
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
        'text-halo-blur': 0.5
      } as SymbolPaint,
      filter: fromJS([
        'all',
        ['has', 'icon'],
        ['==', '$type', 'Point'],
        ['!in', 'geometry', Geometry.VERTEX, Geometry.VERTEX_SHARED]
      ])
    })
  });
