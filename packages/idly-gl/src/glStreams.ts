import { FeatureCollection, Properties } from '@turf/helpers';
import { Map, MapMouseEvent, MapTouchEvent } from 'mapbox-gl/dist/mapbox-gl';
import { Observable } from 'rxjs/Observable';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { FromEventPatternObservable } from 'rxjs/observable/FromEventPatternObservable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { concat } from 'rxjs/operators/concat';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { defaultIfEmpty } from 'rxjs/operators/defaultIfEmpty';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { map as rxMap } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { throttleTime } from 'rxjs/operators/throttleTime';

import { BBox, bboxToTiles } from 'idly-common/lib/geo';
import { tileToQuadkey } from 'idly-common/lib/misc';
import { Entity, EntityType } from 'idly-common/lib/osm/structures';

import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { IDLY_NS } from './constants';
import { fetchTileXml, hideVersion, tilesFilterSmall } from './helper';
import { workerGetQuadkeys } from './plugin/worker';

export function glObservable<T>(
  glMap: Map,
  eventType: string,
  layer?: string
): FromEventPatternObservable<T> {
  return fromEventPattern<T>(
    handler => {
      layer
        ? glMap.on(eventType, layer, handler)
        : glMap.on(eventType, handler);
    },
    handler => {
      layer
        ? glMap.off(eventType, layer, handler)
        : glMap.off(eventType, handler);
    }
  );
}

export function makeMouseup$(
  glMap: any
): FromEventPatternObservable<MapMouseEvent> {
  return glObservable(glMap, 'mouseup');
}

export function makeMousedown$(
  glMap: any
): FromEventPatternObservable<MapMouseEvent> {
  return glObservable(glMap, 'mousedown');
}

export function makeMousemove$(
  glMap: any
): FromEventPatternObservable<MapMouseEvent> {
  return glObservable(glMap, 'mousemove');
}

export function makeClick$(
  glMap: any
): FromEventPatternObservable<MapMouseEvent> {
  return glObservable(glMap, 'click');
}

export function makeTouchstart$(
  glMap: any
): FromEventPatternObservable<MapTouchEvent> {
  return glObservable(glMap, 'touchstart');
}

export function makeTouchend$(
  glMap: any
): FromEventPatternObservable<MapTouchEvent> {
  return glObservable(glMap, 'touchend');
}

export function makeTouchmove$(
  glMap: any
): FromEventPatternObservable<MapTouchEvent> {
  return glObservable(glMap, 'touchmove');
}

export function makeMoveend$(
  glMap: any
): FromEventPatternObservable<MapMouseEvent | MapTouchEvent> {
  return glObservable(glMap, 'moveend');
}

export function makeMouseenter$(
  glMap: any,
  layer: string
): FromEventPatternObservable<MapMouseEvent | MapTouchEvent> {
  return glObservable(glMap, 'mouseenter', layer);
}

export function makeMouseleave$(
  glMap: any,
  layer: string
): FromEventPatternObservable<MapMouseEvent | MapTouchEvent> {
  return glObservable(glMap, 'mouseleave', layer);
}

export function makeQuadkey$(
  glMap: any
): Observable<[string[], FeatureCollection<any, Properties>]> {
  return makeMoveend$(glMap).pipe(
    debounceTime(400),
    startWith('' as any),
    rxMap(() => [glMap.getBounds(), glMap.getZoom() - 1]),
    filter(([_, zoom]) => zoom > 15 && zoom <= 22),
    rxMap(([bounds, zoom]: any) =>
      getTiles(
        [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth(),
        ],
        zoom
      )
    ),
    switchMap(tiles =>
      fromPromise(
        Promise.all(
          tiles.map(
            t =>
              fetchTileXml(t.x, t.y, t.z).then(r => [
                tileToQuadkey(t),
                r,
              ]) as Promise<[string, Entity[]]>
          )
        )
      )
    ),
    mergeMap(d =>
      Promise.all([
        d.map(e => e[0]),
        workerGetQuadkeys(
          d.map(e => ({
            quadkey: e[0],
            entities: e[1],
          }))
        ),
      ])
    )
  );
}

const getTiles = (bbox: BBox, zoom: number) => {
  const tiles = bboxToTiles(bbox, zoom);
  // for small screen devices
  if (tiles.length <= 4) {
    return tiles;
  }
  let minimumOverlap = 0;

  if (zoom < 17) {
    minimumOverlap = 0.7;
  } else if (zoom < 18) {
    minimumOverlap = 0.3;
  } else if (zoom < 19) {
    minimumOverlap = 0.1;
  }
  return tilesFilterSmall(tiles, bbox, minimumOverlap);
};

export function makeSelected$(
  glMap: any,
  findClause: (f: any) => boolean,
  radius = 2
) {
  return makeClick$(glMap).pipe(
    rxMap(e =>
      glMap.queryRenderedFeatures(bboxify(e, radius)).find(findClause)
    ),
    distinctUntilChanged(
      (p, q) =>
        p == null && p === q
          ? true
          : p && q && p.properties.id === q.properties.id
    )
  );
}

export function makeIsNearNode$(glMap: any, radius = 4) {
  return makeMousemove$(glMap).pipe(
    rxMap(e => {
      const eCoords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      return glMap
        .queryRenderedFeatures(bboxify(e, radius))
        .filter((f: any) => f.geometry.type === 'Point' && f.properties.id)[0];
    })
  );
}

export function makeNearestNode$(glMap: any, radius = 4) {
  return makeMousemove$(glMap).pipe(
    throttleTime(50),
    rxMap(e => {
      const eCoords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      return glMap
        .queryRenderedFeatures(bboxify(e, radius))
        .filter((f: any) => f.geometry.type === 'Point' && f.properties.id)
        .sort(
          (a: any, b: any) =>
            distance(eCoords, a._geometry.coordinates) -
            distance(eCoords, b._geometry.coordinates)
        )[0];
    }),
    distinctUntilChanged(
      (p, q) =>
        p == null && p === q
          ? true
          : p && q && p.properties.id === q.properties.id
    )
  );
}

export function makeDrag$(
  glMap: any,
  selected$: Observable<{ id?: string; coords?: [number, number] }>,
  radius: number
): Observable<{
  selectedId?: string;
  drag$: Observable<MapMouseEvent | undefined>;
}> {
  const mousedown$ = makeMousedown$(glMap);
  const mouseup$ = makeMouseup$(glMap);
  const mousemove$ = makeMousemove$(glMap);

  return mousedown$.pipe(
    withLatestFrom(selected$),
    filter(([down, selected]) => {
      if (!selected.id) {
        return false;
      }
      return glMap
        .queryRenderedFeatures(bboxify(down, radius))
        .find((r: any) => hideVersion(r.properties.id) === selected.id);
    }),
    rxMap(([_, selected]) => {
      return {
        selectedId: selected.id,
        drag$: mousemove$.pipe(takeUntil(mouseup$), defaultIfEmpty()),
      };
    })
  );
}

const bboxify = (e: any, factor: number) => [
  [e.point.x - factor, e.point.y - factor],
  [e.point.x + factor, e.point.y + factor],
];

const distance = ([x1, y1]: [number, number], [x2, y2]: [number, number]) =>
  Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
