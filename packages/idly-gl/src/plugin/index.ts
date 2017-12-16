import layers from '../layers';
import shadows from '../shadows';

import { addSource } from '../helper/addSource';
import {
  workerFetchMap,
  workerSetOsmTiles,
  workerGetBbox,
  workerGetEntities
} from './worker/index';
import { BBox } from 'idly-common/lib/geo/bbox';
import * as debounce from 'lodash.debounce';

import { renderPresets } from '../presetsUi/index';
const BASE_SOURCE = 'idly-gl-base-src-1';
const ACTIVE_SOURCE = 'idly-gl-active-src-1';
const SHADOW_SOURCE = 'idly-gl-shadow-src-1';

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
    if (this.map.loaded()) {
      this.init();
    } else {
      this.map.on('load', () => this.init());
    }
    this._container = document.createElement('div');
    return this._container;
  }

  init() {
    this.map.on('click', this.onClick);
    this.map.on('mousemove', this.onHover);

    this.map.addSource(BASE_SOURCE, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    this.map.addSource(ACTIVE_SOURCE, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    this.map.addSource(SHADOW_SOURCE, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    shadows
      .map(r => {
        return { ...r, priority: r.priority + 10 };
      })
      .map(r => addSource(r.layer, SHADOW_SOURCE))
      .forEach(l => this.map.addLayer(l));

    layers
      .map(r => addSource(r.layer, BASE_SOURCE))
      .forEach(l => this.map.addLayer(l));

    // add higher priority for ACTIVE SOURCES
    layers
      .map(r => {
        return { ...r, priority: r.priority + 20 };
      })
      .map(r => addSource(r.layer, ACTIVE_SOURCE))
      .forEach(glLayer => this.map.addLayer(glLayer));
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
        this.data = fc;
        this.map.getSource(BASE_SOURCE).setData(fc);
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
    var d = {
      type: 'FeatureCollection',
      features: [
        this.data.features.find(f => f.properties.id === this.selectedId)
      ]
    };
    this.map.getSource(SHADOW_SOURCE).setData(d);

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
