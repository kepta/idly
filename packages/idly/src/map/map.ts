import { Draw } from 'draw/draw';
import { genMapGl } from 'map/mapboxgl_setup';
import { observe, store } from 'store/index';
import { getOSMTiles } from 'store/osm_tiles/actions';
import { lonlatToXYs, mercator } from 'utils/mecarator';

export const ZOOM = 16;

let unsubscribe;

export class Map {
  private map;
  private draw;
  private xy;
  constructor(divId: string) {
    this.map = genMapGl(divId);
    this.map.on('moveend', this.dispatchTiles);
    this.map.on('load', this.onLoad);
    unsubscribe = observe(state => state.osmTiles, this.receiveProps);
  }
  private receiveProps = d => console.log(d);
  private onLoad = () => {
    this.draw = new Draw(this.map);
    this.map.addSource('layer', someFC());
    this.map.addLayer(someLayer());
  };
  /**
   * Is called whenever map finishes move
   * or the map got loaded.
   * dispatches an action to get the osm tiles.
   */
  private dispatchTiles = () => {
    if (this.map.getZoom() < ZOOM) return;
    const ltlng = this.map.getBounds();
    const xys = lonlatToXYs(ltlng, ZOOM);
    store.dispatch(getOSMTiles(xys, ZOOM));
  };
}

function someLayer() {
  return {
    id: 'park-boundary',
    type: 'fill',
    source: 'layer',
    paint: {
      'fill-color': '#888888',
      'fill-opacity': 0.4
    },
    filter: ['==', '$type', 'Polygon']
  };
}
function someFC() {
  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-121.353637, 40.584978],
                [-121.284551, 40.584758],
                [-121.275349, 40.541646],
                [-121.246768, 40.541017],
                [-121.251343, 40.423383],
                [-121.32687, 40.423768],
                [-121.360619, 40.43479],
                [-121.363694, 40.409124],
                [-121.439713, 40.409197],
                [-121.439711, 40.423791],
                [-121.572133, 40.423548],
                [-121.577415, 40.550766],
                [-121.539486, 40.558107],
                [-121.520284, 40.572459],
                [-121.487219, 40.550822],
                [-121.446951, 40.56319],
                [-121.370644, 40.563267],
                [-121.353637, 40.584978]
              ]
            ]
          }
        }
      ]
    }
  };
}
