import layers from '../layers';
import shadows from '../shadows';

import { BBox, bboxToTiles, mercator } from 'idly-common/lib/geo';
import { cancelablePromise, tileToQuadkey } from 'idly-common/lib/misc';

import parser from 'idly-faster-osm-parser';
import debounce from 'lodash-es/debounce';
import { addSource } from '../helper/addSource';
import {
  worker,
  workerGetMoveNode,
  workerGetQuadkeys,
  workerSetMovePointEntry,
} from './worker/index';

const BASE_SOURCE = 'idly-gl-base-src-1';
const ACTIVE_SOURCE = 'idly-gl-active-src-1';
const SHADOW_SOURCE = 'idly-gl-shadow-src-1';

export class IdlyGlPlugin {
  private map: any;
  private data: any;
  private container: any;
  private prom: any;
  private prom2: any;
  private selectedId: string | undefined;
  // constructor() {}

  public onAdd(map: any) {
    this.map = map;
    if (this.map.loaded()) {
      this.init();
    } else {
      this.map.on('load', () => this.init());
    }
    this.container = document.createElement('div');
    return this.container;
  }

  public init() {
    this.map.on('click', this.onClick);
    this.map.on('mousemove', this.onHover);

    this.map.addSource(BASE_SOURCE, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this.map.addSource(ACTIVE_SOURCE, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this.map.addSource(SHADOW_SOURCE, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
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
    this.map.on('mousedown', this.mouseDown);

    this.map.on('mouseenter', 'point', () => {
      this.map.setPaintProperty('point', 'circle-color', '#3bb2d0');
      this.map.getCanvasContainer().style.cursor = 'move';
      isCursorOverPoint = true;
      this.map.dragPan.disable();
    });

    this.map.on('mouseleave', 'point', () => {
      this.map.setPaintProperty('point', 'circle-color', '#3887be');
      this.map.getCanvasContainer().style.cursor = '';
      isCursorOverPoint = false;
      this.map.dragPan.enable();
    });

    this.map.addSource('fucha', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this.map.addLayer({
      id: 'point',
      type: 'circle',
      source: 'fucha',
      minzoom: 18.5,
      paint: {
        'circle-radius': 5,
        'circle-color': '#fff',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#000',
      },
    });

    this.render();
  }
  public render = () => {
    const zoom = this.map.getZoom() - 1;
    if (zoom < 15) {
      return;
    }
    const lonLat = this.map.getBounds();
    const bbox: BBox = [
      lonLat.getWest(),
      lonLat.getSouth(),
      lonLat.getEast(),
      lonLat.getNorth(),
    ];

    this.prom && this.prom.cancel();

    this.prom = cancelablePromise(
      Promise.all(
        bboxToTiles(bbox, zoom)
          // .filter(t => cache.has(tileToQuadkey(t)))
          .map(t =>
            fetchTileXml(t.x, t.y, t.z).then(r => [tileToQuadkey(t), r])
          )
      )
    );

    this.prom.promise.then(arrays => {
      this.prom2 && this.prom2.cancel();

      this.qKeys = arrays.map(e => e[0]);
      this.prom2 = cancelablePromise(
        workerGetQuadkeys(
          arrays.map(e => ({
            quadkey: e[0],
            entities: e[1],
          }))
        )
      );

      this.prom2.promise.then(fcs => {
        this.map.getSource(BASE_SOURCE).setData(fcs);
      });
    });
  };
  public onClick = (e: any) => {
    const bbox = bboxify(e, 3);
    const features = this.map.queryRenderedFeatures(bbox);
    const feat = features.find(
      (f: any) => f.properties.id && f.geometry.type === 'Point'
    );
    if (feat) {
      this.selectedId = feat.properties.id;
      this.map.getSource('fucha').setData(makePoint(feat.geometry.coordinates));
      // this.onIdSelect(feat);
    } else {
      this.onIdDeselect();
      this.map.getSource('fucha').setData(makePoint([0, 0]));
    }
  };

  public onIdSelect = async (feature: any) => {
    this.selectedId = feature.properties.id;
    if (!this.selectedId) {
      return;
    }
  };

  public onIdDeselect = () => {
    this.selectedId = undefined;
  };

  public onHover = () => {
    // this.map.getCanvas().style.cursor = featureId ? 'pointer' : '')
    // );
  };
  public mouseDown = () => {
    if (!isCursorOverPoint) {
      return;
    }

    isDragging = true;

    // Set a cursor indicator
    this.map.getCanvasContainer().style.cursor = 'grab';

    // Mouse events
    this.map.on('mousemove', this.onMove);

    this.map.once('mouseup', this.onUp);
  };
  public onMove = (e: any) => {
    if (!isDragging) {
      return;
    }
    const coords = e.lngLat;

    // Set a UI indicator for dragging.
    this.map.getCanvasContainer().style.cursor = 'grabbing';

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.

    this.map.getSource('fucha').setData(makePoint([coords.lng, coords.lat]));
  };
  public onUp = e => {
    if (!isDragging) {
      return;
    }
    this.map.getCanvasContainer().style.cursor = '';
    isDragging = false;
    workerGetMoveNode({
      id: this.selectedId,
      quadkeys: this.qKeys,
      loc: e.lngLat,
    }).then(r => {
      this.map.getSource(BASE_SOURCE).setData(r);
    });
    // workerSetMovePointEntry({ entity: [this.selectedId, e.lngLat] });
    // Unbind mouse events
    this.map.off('mousemove', this.onMove);
  };
}
function bboxify(e: any, factor: number) {
  return [
    [e.point.x - factor, e.point.y - factor],
    [e.point.x + factor, e.point.y + factor],
  ];
}

const cache: any = new Map();

export async function fetchTileXml(
  x: number,
  y: number,
  zoom: number
): Promise<any> {
  const bboxStr = mercator.bbox(x, y, zoom).join(',');
  if (cache.has(bboxStr)) {
    return cache.get(bboxStr);
  }
  const response = await fetch(
    `https://www.openstreetmap.org/api/0.6/map?bbox=${bboxStr}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const entities = parser(await response.text());
  cache.set(bboxStr, entities);
  return entities;
}

const makePoint = (coords: [number, number]) => ({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coords,
      },
    },
  ],
});
let isDragging: boolean;
let isCursorOverPoint: boolean;

// function onMove(e) {
//   if (!isDragging) {
//     return;
//   }
//   const coords = e.lngLat;

//   // Set a UI indicator for dragging.
//   canvas.style.cursor = 'grabbing';

//   // Update the Point feature in `geojson` coordinates
//   // and call setData to the source layer `point` on it.
//   geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
//   map.getSource('point').setData(geojson);
// }
