import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map as rxMap } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { MainTabs, Store } from '../store/index';
import { entities, visibleGlLayers } from '../store/map.derived';
import { makeClick$, makeNearestEntity$, moveEndBbox$ } from '../streams';
import { workerOperations } from '../worker';
import { Actions } from './Actions';

export function selectEntityStream(
  map: Observable<Store['selectEntity']>,
  actions: Actions
) {
  const fc = map
    .pipe(
      rxMap(({ selectedId }) => selectedId),
      distinctUntilChanged(),
      switchMap((selectedId = '') =>
        fromPromise(workerOperations.getDerived({ id: selectedId }))
      )
    )
    .subscribe(r => actions.addEntityTree(r.derived), e => console.error(e));

  return () => {
    [fc].forEach(s => s.unsubscribe());
    return;
  };
}
