import { BBox, bboxToTiles } from 'idly-common/lib/geo';
import { tileToQuadkey } from 'idly-common/lib/misc';
import { Map, MapMouseEvent, MapTouchEvent } from 'mapbox-gl/dist/mapbox-gl';
import { Observable } from 'rxjs/Observable';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { defaultIfEmpty } from 'rxjs/operators/defaultIfEmpty';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { map as rxMap } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { Subject } from 'rxjs/Subject';

import { mapInteraction, quadkey } from './configuration';
import { bboxify, tilesFilterSmall } from './helpers/helpers';

export function glObservable<T>(
  glMap: Map,
  eventType: string,
  destroy: Subject<void>,
  layer?: string
): Observable<T> {
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
  ).pipe(takeUntil(destroy));
}

export function makeMouseup$(
  glMap: any,
  destroy: Subject<void>
): Observable<MapMouseEvent> {
  return glObservable(glMap, 'mouseup', destroy);
}

export function makeMousedown$(
  glMap: any,
  destroy: Subject<void>
): Observable<MapMouseEvent> {
  return glObservable(glMap, 'mousedown', destroy);
}

export function makeMousemove$(
  glMap: any,
  destroy: Subject<void>
): Observable<MapMouseEvent> {
  return glObservable(glMap, 'mousemove', destroy);
}

export function makeClick$(
  glMap: any,
  destroy: Subject<void>
): Observable<MapMouseEvent> {
  return glObservable(glMap, 'click', destroy);
}

export function makeTouchstart$(
  glMap: any,
  destroy: Subject<void>
): Observable<MapTouchEvent> {
  return glObservable(glMap, 'touchstart', destroy);
}

export function makeTouchend$(
  glMap: any,
  destroy: Subject<void>
): Observable<MapTouchEvent> {
  return glObservable(glMap, 'touchend', destroy);
}

export function makeTouchmove$(
  glMap: any,
  destroy: Subject<void>
): Observable<MapTouchEvent> {
  return glObservable(glMap, 'touchmove', destroy);
}

export function makeMoveend$(
  glMap: any,
  destroy: Subject<void>
): Observable<MapMouseEvent | MapTouchEvent> {
  return glObservable(glMap, 'moveend', destroy);
}

export function makeMouseenter$(
  glMap: any,
  layer: string,
  destroy: Subject<void>
): Observable<MapMouseEvent | MapTouchEvent> {
  return glObservable(glMap, 'mouseenter', destroy, layer);
}

export function makeMouseleave$(
  glMap: any,
  layer: string,
  destroy: Subject<void>
): Observable<MapMouseEvent | MapTouchEvent> {
  return glObservable(glMap, 'mouseleave', destroy, layer);
}

export function makeBoundsAndZoom$(glMap: any, destroy: Subject<void>) {
  return makeMoveend$(glMap, destroy).pipe(
    debounceTime(450),
    startWith('' as any),
    rxMap(() => ({
      bounds: glMap.getBounds(),
      zoom: glMap.getZoom() as number,
    }))
  );
}

export function makeQuadkeys$(glMap: any, destroy: Subject<void>) {
  const CHILD = ['0', '1', '2', '3'];
  const quadkeyGetChildren = (q: string) => CHILD.map(c => q + c);

  return makeBoundsAndZoom$(glMap, destroy).pipe(
    filter(({ zoom }) => zoom > quadkey.ZOOM_MIN && zoom <= quadkey.ZOOM_MAX),
    rxMap(({ bounds, zoom }) => {
      const quadkeys = getTiles(
        [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth(),
        ],
        zoom
      ).map(tileToQuadkey);

      const qSet = new Set(quadkeys);
      const result = new Set();
      quadkeys.forEach(q => {
        const parent = q.substr(0, q.length - 1);
        if (quadkeyGetChildren(parent).every(c => qSet.has(c))) {
          result.add(parent);
        } else {
          result.add(q);
        }
      });
      return [...result];
    })
  );
}

export function makeLoadingQuadkeys$(
  glMap: any,
  destroy: Subject<void>
): Observable<string[]> {
  return makeMoveend$(glMap, destroy).pipe(
    debounceTime(600),
    startWith('' as any),
    rxMap(() => [glMap.getBounds(), glMap.getZoom()]),
    filter(
      ([_, zoom]) => zoom > quadkey.ZOOM_MIN - 2 && zoom <= quadkey.ZOOM_MAX
    ),
    rxMap(([bounds, zoom]: any) => {
      const tiles = bboxToTiles(
        [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth(),
        ],
        zoom < quadkey.ZOOM_MIN ? quadkey.ZOOM_MIN : zoom + 2
      );

      return tiles.map(tileToQuadkey);
    })
  );
}

export function makeHover$(
  glMap: any,
  layer: string,
  destroy: Subject<void>,
  mouseenter$ = makeMouseenter$(glMap, layer, destroy),
  mouseleave$ = makeMouseleave$(glMap, layer, destroy)
): Observable<MapMouseEvent | MapTouchEvent> {
  return merge(mouseenter$, mouseleave$);
}

export function makeNearestEntity$(
  glMap: any,
  destroy: Subject<void>,
  layerObs: Observable<any>,
  radius = mapInteraction.RADIUS
): Observable<{ data: string[]; point: MapMouseEvent }> {
  const sortOrder: any = {
    n: 3,
    w: 2,
    r: 1,
  };
  return makeMousemove$(glMap, destroy).pipe(
    throttleTime(50),
    withLatestFrom(layerObs),
    rxMap(([e, layers]) => {
      const ids: string[] = glMap
        .queryRenderedFeatures(bboxify(e, radius), {
          layers,
          filter: ['has', 'id'],
        })
        .filter((f: any) => f.properties.id)
        .sort((a: any, b: any) => {
          return (
            sortOrder[b.properties.id.charAt(0)] -
            sortOrder[a.properties.id.charAt(0)]
          );
        })
        .map((a: any) => a.properties.id);

      return { data: [...new Set(ids)], point: e };
    }),
    distinctUntilChanged(({ data: p }, { data: q }) => {
      if (p.length !== q.length) {
        return false;
      }
      for (let i = 0; i < p.length; i++) {
        if (p[i] !== q[i]) {
          return false;
        }
      }
      return true;
    })
  );
}

export function makeDrag$(
  glMap: any,
  layer: string,
  destroy: Subject<void>,
  mousehover$ = makeHover$(glMap, layer, destroy),
  mousedown$ = makeMousedown$(glMap, destroy),
  mouseup$ = makeMouseup$(glMap, destroy),
  mousemove$ = makeMousemove$(glMap, destroy)
): Observable<Observable<MapMouseEvent | undefined>> {
  return mousedown$.pipe(
    withLatestFrom(mousehover$),
    filter(([_, event]) => event.type === 'mouseenter'),
    rxMap(([_]) => mousemove$.pipe(takeUntil(mouseup$), defaultIfEmpty()))
  );
}

const getTiles = (bbox: BBox, zoom: number) => {
  // actual zoom has 1 less for smaller quadkey
  const tiles = bboxToTiles(bbox, zoom < 20 ? zoom - 1 : 20);
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
