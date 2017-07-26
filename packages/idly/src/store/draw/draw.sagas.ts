import { List, Set } from 'immutable';

import { featToNode } from 'map/featToNode';
import { nodeToFeat } from 'map/nodeToFeat';
import { Node } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';
import { getTypeFromID } from 'osm/misc';
import { SagaIterator } from 'redux-saga';
import { all, put, select, takeLatest } from 'redux-saga/effects';
import { IRootStateType } from 'store';
import { Action, action } from 'store/actions';
import { CORE } from 'store/core/core.actions';
import {
  CommitFeaturesAction,
  DRAW,
  IDrawSelect,
  SelectFeaturesAction
} from 'store/draw/draw.actions';

export function* watchDraw(): SagaIterator {
  yield all([
    takeLatest<SelectFeaturesAction>(DRAW.selectFeatures, selectSaga),
    takeLatest<CommitFeaturesAction>(DRAW.commit, commitSaga)
  ]);
  //   yield all([call(watchFetch)]);
}

export function* selectSaga({ type, features }: SelectFeaturesAction) {
  yield all([
    put(
      action(DRAW.updateSelection, {
        selectedFeatures: features
      })
    ),
    put(
      action(CORE.removeIds, {
        modifedEntitiesId: features.map(f => f.id)
      })
    )
  ]);
}

export function* commitSaga({ features }: CommitFeaturesAction) {
  yield put(
    action(CORE.addModified, {
      modifedEntities: List(features.map(feat => featToNode(feat)))
    })
  );
}
