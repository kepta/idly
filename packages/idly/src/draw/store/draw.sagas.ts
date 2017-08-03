import { Set } from 'immutable';
import { SagaIterator } from 'redux-saga';
import { all, put, takeLatest } from 'redux-saga/effects';

import { action } from 'common/actions';
import { CORE } from 'core/store/core.actions';
import { featToNode } from 'map/utils/featToNode';
import { Node } from 'osm/entities/node';

import { DRAW, SelectFeaturesAction } from 'draw/store/draw.actions';

export function* watchDraw(): SagaIterator {
  yield all([
    takeLatest<SelectFeaturesAction>(DRAW.selectFeatures, selectSaga)
    // takeLatest<CommitFeaturesAction>(DRAW.commit, commitSaga)
  ]);
  //   yield all([call(watchFetch)]);
}

export function* selectSaga({
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
          modifiedEntitiesId: Set(featuresToSelect.map(f => f.id))
        })
      )
    ]);
  if (featuresThatWereSelected.size > 0)
    yield put(
      action(CORE.addModified, {
        modifiedEntities: Set(
          featuresThatWereSelected.map(feat => featToNode(feat))
        )
        // modifiedEntitiesId: Set(featuresThatWereSelected.map(feat => feat.id))
      })
    );
}
