import { FeatureCollection, Properties } from '@turf/helpers';
import { Map, MapMouseEvent, MapTouchEvent } from 'mapbox-gl/dist/mapbox-gl';
import { Observable } from 'rxjs/Observable';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { FromEventPatternObservable } from 'rxjs/observable/FromEventPatternObservable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { defaultIfEmpty } from 'rxjs/operators/defaultIfEmpty';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { map as rxMap } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';

import { BBox, bboxToTiles } from 'idly-common/lib/geo';
import { tileToQuadkey } from 'idly-common/lib/misc';
import { Entity } from 'idly-common/lib/osm/structures';

import { merge } from 'rxjs/observable/merge';
import { mapInteraction, quadkey } from './configuration';
import {
  bboxify,
  distance,
  fetchTileXml,
  tilesFilterSmall,
} from './helpers/helper';
import { workerOperations } from './plugin/worker2';
// import { workerGetQuadkeys } from './plugin/worker';

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
    debounceTime(450),
    startWith('' as any),
    rxMap(() => [glMap.getBounds(), glMap.getZoom()]),
    filter(([_, zoom]) => zoom > quadkey.ZOOM_MIN && zoom <= quadkey.ZOOM_MAX),
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
    switchMap(d => {
      console.time('getQuadkey');
      window.res = d.map(e => ({
        quadkey: e[0],
        entities: e[1],
      }));
      return fromPromise(
        Promise.all([
          d.map(e => e[0]),
          workerOperations.getQuadkeys(
            d.map(e => ({
              quadkey: e[0],
              entities: e[1],
            }))
          ),
        ])
      );
    })
  );
}

export function makeHover$(
  glMap: any,
  layer: string,
  mouseenter$ = makeMouseenter$(glMap, layer),
  mouseleave$ = makeMouseleave$(glMap, layer)
): Observable<MapMouseEvent | MapTouchEvent> {
  return merge(mouseenter$, mouseleave$);
}

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

export function makeIsNearNode$(glMap: any, radius = mapInteraction.RADIUS) {
  return makeMousemove$(glMap).pipe(
    debounceTime(80),
    rxMap(e => {
      const eCoords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      return glMap
        .queryRenderedFeatures(bboxify(e, radius))
        .filter((f: any) => f.geometry.type === 'Point' && f.properties.id)[0];
    })
  );
}

export function makeNearestNode$(glMap: any, radius = mapInteraction.RADIUS) {
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
  layer: string,
  radius = mapInteraction.RADIUS,
  mousehover$ = makeHover$(glMap, layer),
  mousedown$ = makeMousedown$(glMap),
  mouseup$ = makeMouseup$(glMap),
  mousemove$ = makeMousemove$(glMap)
): Observable<Observable<MapMouseEvent | undefined>> {
  return mousedown$.pipe(
    withLatestFrom(mousehover$),
    filter(([_, event]) => event.type === 'mouseenter'),
    rxMap(([_, selected]) =>
      mousemove$.pipe(takeUntil(mouseup$), defaultIfEmpty())
    )
  );
}

const getTiles = (bbox: BBox, zoom: number) => {
  // actual zoom has 1 less for smaller quadkey
  console.log(zoom);
  const tiles = bboxToTiles(bbox, zoom < 20 ? zoom - 1 : 19);
  // for small screen devices
  if (tiles.length <= 4) {
    return tiles;
  }
  let minimumOverlap = quadkey.OVERLAP.ABOVE_19;

  if (zoom < 17) {
    minimumOverlap = quadkey.OVERLAP.LESS_THAN_17;
  } else if (zoom < 18) {
    minimumOverlap = quadkey.OVERLAP.LESS_THAN_18;
  } else if (zoom < 19) {
    minimumOverlap = quadkey.OVERLAP.LESS_THAN_19;
  }

  return tilesFilterSmall(tiles, bbox, minimumOverlap);
};
