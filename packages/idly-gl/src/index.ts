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

import { mergeMap } from 'rxjs/operators/mergeMap';
import {
  glObservable,
  makeClick$,
  makeDrag$,
  makeMousedown$,
  makeMouseenter$,
  makeMouseleave$,
  makeMousemove$,
  makeMouseup$,
  makeNearestNode$,
  makeQuadkey$,
  makeSelected$,
  makeIsNearNode$,
} from './glStreams';
import {
  addSource,
  bboxify,
  blankFC,
  getNameSpacedLayerId,
  hideVersion,
} from './helper';
import layers from './layers';
import pointsDraggable from './layers/interactive/pointsDraggable';
import { workerGetMoveNode } from './plugin/worker';

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

    makeQuadkey$(this.map).forEach(([quadkeys, fc]) => {
      this.lastQuadkey = quadkeys;
      this.renderMap(fc);
    });

    const pointAdder = addSinglePoint(this.map);

    const nearestNode$ = makeNearestNode$(this.map, 6).pipe(
      rxMap(f => ({
        id: f && hideVersion(f.properties.id),
        coords: f && f.geometry.coordinates,
      }))
    );

    makeIsNearNode$(this.map, 10).forEach(r => {
      if (r) {
        this.map.dragPan.disable();
      } else {
        this.map.dragPan.enable();
      }
    });

    nearestNode$.forEach(r => {
      pointAdder('nearest-node', r.coords);
    });

    const selectedId$ = makeSelected$(
      this.map,
      (f: any) => f.properties.id && f.geometry.type === 'Point',
      6
    ).pipe(
      rxMap(f => ({
        id: f && hideVersion(f.properties.id),
        coords: f && f.geometry.coordinates,
      }))
    );

    makeDrag$(this.map, selectedId$, 6).forEach(({ selectedId, drag$ }) => {
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
        workerGetMoveNode({
          id: selectedId,
          quadkeys: this.lastQuadkey,
          loc: p.lngLat,
        }).then(r => {
          this.map.getSource(BASE_SOURCE).setData(r);
        });
      });
    });

    selectedId$.forEach(r => {
      pointAdder('selected-node', r.coords, {
        paint: {
          'circle-radius': 6,
          'circle-color': '#3bb2d0',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000',
        },
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
    (this.map.getSource(BASE_SOURCE) as any).setData(fc);
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
          'circle-radius': 6,
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
