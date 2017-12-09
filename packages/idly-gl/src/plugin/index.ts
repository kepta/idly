import layers from '../layers';
import { addSource } from '../helper/addSource';
import {
  workerFetchMap,
  workerSetOsmTiles,
  workerGetBbox,
  workerGetEntities
} from './worker/index';
import { feature } from '@turf/helpers';
import { BBox } from 'idly-common/lib/geo/bbox';
import * as debounce from 'lodash.debounce';

import { Leaf } from 'idly-common/lib/state/graph/Leaf';
import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { renderPresets } from '../presetsUi/index';
const SOURCE_1 = 'idly-gl-src-1';

export class IdlyGlPlugin {
  private map: any;
  private opts: any;
  private _container: any;
  private selectedId: string | undefined;
  constructor(opts: { [index: string]: string }) {
    this.opts = opts;
  }
  onAdd(map: any) {
    this.map = map;
    window.map = map;
    window.plugin = this;
    if (this.map.loaded()) {
      this.init();
    } else {
      this.map.on('load', () => this.init());
    }
    this._container = document.createElement('div');
    // this._container.className = 'mapboxgl-ctrl';
    // this._container.textContent = 'Hello, world';
    return this._container;
  }

  init() {
    this.map.on('click', this.onClick);
    this.map.on('mousemove', this.onHover);

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

    this.map.on('moveend', debounce(this.render, 200));
    this.render();
  }
  render = () => {
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
    // workerGetBbox({ bbox }).then(fc => {
    //   this.map.getSource(SOURCE_1).setData(fc);
    // });
  };
  onClick = e => {
    const bbox = bboxify(e, 3);
    const features = this.map.queryRenderedFeatures(bbox);
    const feat = features.find(f => f.properties.id);
    if (feat && feat.properties) {
      this.onIdSelect(feat);
    } else {
      this.onIdDeselect();
    }
  };

  onIdSelect = async (feature: any) => {
    this.selectedId = feature.properties.id;
    if (!this.selectedId) {
      return;
    }
    const shrub = await workerGetEntities({
      entityIds: [this.selectedId]
    });
    const leaf = shrub.getDependant(this.selectedId);

    if (!leaf) return;

    renderPresets(this._container, { feature, leaf });
  };

  onIdDeselect = () => {
    this.selectedId = undefined;
  };

  onHover = e => {
    // this.map.getCanvas().style.cursor = featureId ? 'pointer' : '')
    // );
  };
  onRemove() {}
}
function bboxify(e, factor) {
  return [
    [e.point.x - factor, e.point.y - factor],
    [e.point.x + factor, e.point.y + factor]
  ];
}
