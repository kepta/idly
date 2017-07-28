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
  DRAW,
  IDrawSelect,
  SelectFeaturesAction
} from 'store/draw/draw.actions';

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
          modifedEntitiesId: Set(featuresToSelect.map(f => f.id))
        })
      )
    ]);
  if (featuresThatWereSelected.size > 0)
    yield put(
      action(CORE.addModified, {
        modifedEntities: Set(
          featuresThatWereSelected.map(feat => featToNode(feat))
        )
        // modifiedEntitiesId: Set(featuresThatWereSelected.map(feat => feat.id))
      })
    );
}

// export function* commitSaga({ features }: CommitFeaturesAction) {
//   yield put(
//     action(CORE.addModified, {
//       modifedEntities: Set(features.map(feat => featToNode(feat))),
//       modifiedEntitiesId: Set(features.map(feat => feat.id))
//     })
//   );
// }
