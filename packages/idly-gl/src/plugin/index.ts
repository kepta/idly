import layers from '../layers';
import { addSource } from '../helper/addSource';

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
      return this.init();
    }
    return this.map.on('load', () => this.init());
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
  }
  onRemove() {}
}
