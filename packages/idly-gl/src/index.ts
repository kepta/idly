import { FeatureCollection, Properties } from '@turf/helpers';
import {
  EventData,
  Map as GlMap,
  MapMouseEvent,
  MapTouchEvent,
} from 'mapbox-gl/dist/mapbox-gl';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { last } from 'rxjs/operators/last';
import { map as rxMap } from 'rxjs/operators/map';
import { merge } from 'rxjs/operators/merge';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';

import { addSource, hideVersion } from './helpers/helper';
import layers from './layers';
import { workerGetMoveNode } from './plugin/worker';
import {
  makeDrag$,
  makeHover$,
  makeMouseenter$,
  makeMouseleave$,
  makeNearestNode$,
  makeQuadkey$,
  makeSelected$,
} from './streams';

export interface Options {
  good: boolean;
}

const BASE_SOURCE = 'idly-gl-base-src';
const DRAGGABLE_SOURCE = 'idly-gl-drag';
const DRAGGABLE_POINT = 'drag-point';

export class IdlyGlPlugin {
  private opts: Options;

  private selectedId?: string;
  // @ts-ignore
  private lastQuadkey: any[];
  // @ts-ignore
  private map: GlMap;
  // @ts-ignore
  private container: any;

  constructor(opts: Options) {
    this.opts = opts;
  }

  public onAdd(m: GlMap) {
    // @ts-ignore
    window.map = m;

    this.map = m;
    if (this.map.loaded()) {
      this.init();
    } else {
      this.map.on('load', () => this.init());
    }

    this.container = document.createElement('div');

    return this.container;
  }

  private init() {
    this.addStyling();

    const pointAdder = addSinglePoint(this.map);
    const canvas = this.map.getCanvasContainer();

    const nearestNode$ = makeNearestNode$(this.map, 8).pipe(
      rxMap(f => ({
        id: f && hideVersion(f.properties.id),
        coords: f && f.geometry.coordinates,
      }))
    );

    const quadkey$ = makeQuadkey$(this.map);

    const mouseenterSelectedNode$ = makeMouseenter$(
      this.map,
      `idly-layer-selected-node`
    );

    const mouseleaveSelectedNode$ = makeMouseleave$(
      this.map,
      `idly-layer-selected-node`
    );

    const mousehoverSelectedNode$ = makeHover$(
      this.map,
      `idly-layer-selected-node`,
      mouseenterSelectedNode$,
      mouseleaveSelectedNode$
    );

    const selectedPoint$ = makeSelected$(
      this.map,
      (f: any) => f.properties.id && f.geometry.type === 'Point',
      8
    ).pipe(
      rxMap(f => ({
        id: f && hideVersion(f.properties.id),
        coords: f && f.geometry.coordinates,
      }))
    );

    const dragSelectedNode$ = makeDrag$(
      this.map,
      `idly-layer-selected-node`,
      8,
      mousehoverSelectedNode$
    ).pipe(withLatestFrom(selectedPoint$));

    quadkey$.forEach(([quadkeys, fc]) => {
      this.lastQuadkey = quadkeys;
      this.renderMap(fc);
    });

    mouseenterSelectedNode$.forEach(() => {
      canvas.style.cursor = 'move';
      this.map.dragPan.disable();
    });

    mouseleaveSelectedNode$.forEach(() => {
      canvas.style.cursor = '';
      this.map.dragPan.enable();
    });

    selectedPoint$.forEach(r => {
      pointAdder('selected-node', r.coords, {
        paint: {
          'circle-radius': 8,
          'circle-color': '#3bb2d0',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000',
        },
      });
    });

    nearestNode$.forEach(r => {
      pointAdder('nearest-node', r.coords);
    });

    dragSelectedNode$.forEach(([drag$, selected]) => {
      drag$.forEach(p => {
        if (!p) {
          return;
        }
        pointAdder('selected-node', [p.lngLat.lng, p.lngLat.lat]);
      });

      drag$.pipe(last()).forEach(p => {
        if (!p) {
          return;
        }
        console.time('moveNode');
        workerGetMoveNode({
          id: selected.id,
          quadkeys: this.lastQuadkey,
          loc: p.lngLat,
        }).then(r => {
          this.map.getSource(BASE_SOURCE).setData(r);
          console.timeEnd('moveNode');
        });
      });
    });
  }

  private addStyling() {
    this.map.addSource(BASE_SOURCE, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    layers
      .map(r => addSource(r.layer, BASE_SOURCE))
      .forEach(l => this.map.addLayer(l));
  }

  private renderMap(fc: FeatureCollection<any, Properties>) {
    window.result = fc.features;

    (this.map.getSource(BASE_SOURCE) as any).setData(fc);
    console.timeEnd('getQuadkey');
  }
}

function addSinglePoint(glMap: any) {
  const record: Map<
    string,
    { source: string; layer: string; style: any }
  > = new Map();
  return (
    uid: string,
    coords: [number, number] | undefined,
    style?: { [index: string]: any }
  ) => {
    let point = record.get(uid);

    if (!point) {
      glMap.addSource(`idly-src-${uid}`, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: !coords
            ? []
            : [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: coords,
                  },
                },
              ],
        },
      });

      style = {
        type: 'circle',
        minzoom: 18.5,
        paint: {
          'circle-radius': 8,
          'circle-color': '#fff',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#000',
        },
        ...style,
        id: `idly-layer-${uid}`,
        source: `idly-src-${uid}`,
      };

      glMap.addLayer(style);
      point = {
        source: `idly-src-${uid}`,
        layer: `idly-layer-${uid}`,
        style,
      };
      record.set(uid, point);
      return;
    }
    glMap.getSource(point.source).setData({
      type: 'FeatureCollection',
      features: !coords
        ? []
        : [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: coords,
              },
            },
          ],
    });
  };
}
