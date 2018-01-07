import * as React from 'react';
import * as mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import layers from 'idly-gl/lib/layers';
import { addSource } from 'idly-gl/lib/helper/addSource';

import data from '../../map/data.json';

(mapboxgl as any).accessToken =
  'pk.eyJ1Ijoia3VzaGFuMjAyMCIsImEiOiJjaWw5dG56enEwMGV6dWVsemxwMWw5NnM5In0.BbEUL1-qRFSHt7yHMorwew';

export class Map extends React.PureComponent {
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        sprite: 'mapbox://sprites/kushan2020/cjb9aalgp581d2rqu5m7h6byc',
        glyphs:
          'https://api.mapbox.com/fonts/v1/mapbox/{fontstack}/{range}.pbf?access_token=pk.eyJ1Ijoia3VzaGFuMjAyMCIsImEiOiJjaWw5dG56enEwMGV6dWVsemxwMWw5NnM5In0.BbEUL1-qRFSHt7yHMorwew',
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://ecn.t0.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
              'https://ecn.t1.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
              'https://ecn.t2.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
              'https://ecn.t3.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z'
            ]
          }
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [-68.13734351262877, 45.137451890638886],
      zoom: 5,
      hash: true
    });

    map.on('load', function() {
      map.addSource('virgin', {
        type: 'geojson',
        data
      });

      layers
        .map(r => addSource(r.layer, 'virgin'))
        .forEach(l => map.addLayer(l));
    });
  }
  render() {
    return <div id="map" style={{ width: '60vw', height: '100vh' }} />;
  }
}
