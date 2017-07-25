import { List, Set } from 'immutable';

import { nodeToFeat } from 'map/nodeToFeat';
import { nodeFactory } from 'osm';
import { Node } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';
import { getTypeFromID } from 'osm/misc';
import { SagaIterator } from 'redux-saga';
import { all, put, select, takeLatest } from 'redux-saga/effects';
import { IRootStateType } from 'store';
import { Action, action } from 'store/actions';
import { CORE, removeEntitiesById } from 'store/core/core.actions';
import { DRAW, ICommitModified, IDrawSelect } from 'store/draw/draw.actions';

export function* watchDraw(): SagaIterator {
  yield all([
    takeLatest<Action<IDrawSelect>>(DRAW.selectFeatures, selectSaga),
    takeLatest<Action<ICommitModified>>(DRAW.commit, commitSaga)
  ]);
  //   yield all([call(watchFetch)]);
}

export function* selectSaga({ type, features }: Action<IDrawSelect>) {
  const node: Node = yield select((state: IRootStateType) =>
    state.core.graph.getIn([
      getTypeFromID(features[0].properties.id),
      features[0].properties.id
    ])
  );
  // console.log(features);
  // node = node.set('loc', genLngLat(features[0]._geometry.coordinates));
  // console.log(node);
  yield put(
    action(DRAW.updateSelection, {
      selectedFeatures: List([nodeToFeat(node)])
    })
  );
  yield put(removeEntitiesById(features.map(f => f.properties.id)));
}

export function* commitSaga({ features }: Action<ICommitModified>) {
  const nodes = Set(
    features.map(n =>
      nodeFactory({
        id: n.id,
        loc: genLngLat({
          lon: n.geometry.coordinates[0],
          lat: n.geometry.coordinates[1]
        })
      })
    )
  );
  yield put(action(CORE.addModified, { modifedEntities: nodes }));
}
