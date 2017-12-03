import layers from '../layers';
import { addSource } from '../helper/addSource';
import { workerFetchMap, workerSetOsmTiles } from './worker/index';
import { BBox } from 'idly-common/lib/geo/bbox';

const SOURCE_1 = 'idly-gl-src-1';

export class IdlyGlPlugin {
  private map: any;
  private opts: any;
  constructor(opts: { [index: string]: string }) {
    this.opts = opts;
  }
  onAdd(map: any) {
    this.map = map;
    if (this.map.loaded()) {
      this.init();
    } else {
      this.map.on('load', () => this.init());
    }
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl';
    this._container.textContent = 'Hello, world';
    return this._container;
  }

  init() {
    this.map.addSource(SOURCE_1, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    layers
      .map(r => addSource(r.layer, SOURCE_1))
      .forEach(l => this.map.addLayer(l));

    this.map.on('moveend', () => this.render());
    this.render();
  }
  render() {
    const zoom = this.map.getZoom() - 1;
    if (zoom < 15) return;
    const lonLat = this.map.getBounds();
    const bbox: BBox = [
      lonLat.getWest(),
      lonLat.getSouth(),
      lonLat.getEast(),
      lonLat.getNorth()
    ];

    workerSetOsmTiles({ bbox, zoom }).then(() => {
      workerFetchMap({
        bbox,
        zoom
      }).then(fc => {
        this.map.getSource(SOURCE_1).setData(fc);
      });
    });
  }
  onRemove() {}
}
