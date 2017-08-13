import { Set } from 'immutable';
import { SagaIterator } from 'redux-saga';
import { all, put, select, takeLatest } from 'redux-saga/effects';

import { action } from 'common/actions';
import { CORE, coreHideAction } from 'core/store/core.actions';
import { featToNode } from 'map/utils/featToNode';
import { Graph } from 'osm/history/graph';

import { IRootStateType } from 'common/store';
import { DrawActions, IDrawSelect } from 'draw/store/draw.actions';
import { featToWay } from 'map/utils/featToWay';
import * as R from 'ramda';

export function* watchDraw(): SagaIterator {
  yield all([takeLatest<IDrawSelect>(DrawActions.SELECT, selectSaga)]);
}

export function* selectSaga({ type, ids }: IDrawSelect) {
  const graph: Graph = yield select(
    (state: IRootStateType) => state.core.graph
  );
  const selected = ids.map(i => graph.getEntity(i)).toSet();
  yield put(coreHideAction(ids));
  yield put(action(DrawActions.APPEND_SELECT, { selected }));
}

export function* selectSagas({
  type,
  featuresToSelect,
  featuresThatWereSelected
}: SelectFeaturesAction) {
  if (featuresToSelect.size > 0)
    yield all([
      put(
        action(DRAW.updateSelection, {
          selectedFeatures: featuresToSelect
        })
      ),
      put(
        action(CORE.removeIds, {
          modifiedEntitiesId: Set(featuresToSelect)
        })
      )
    ]);
  if (featuresThatWereSelected.size > 0) {
    const { graph, modifiedGraph } = yield select(
      (state: IRootStateType) => state.core
    );
    // console.log(
    //   R.flatten(
    //     featuresThatWereSelected.toArray().map(feat => {
    //       if (feat.properties.id[0] === 'n') return featToNode(feat);
    //       if (feat.properties.id[0] === 'w') return featToWay(feat, graph);
    //     })
    //   )
    // );
    yield put(
      action(CORE.addModified, {
        modifiedEntities: Set(
          R.flatten(
            featuresThatWereSelected.toArray().map(feat => {
              if (feat.properties.id[0] === 'n') return featToNode(feat);
              if (feat.properties.id[0] === 'w')
                if (graph.way.has(feat.properties.id))
                  return featToWay(feat, graph);
              return featToWay(feat, modifiedGraph);
            })
          )
        )
        // modifiedEntitiesId: Set(featuresThatWereSelected.map(feat => feat.id))
      })
    );
  }
}
