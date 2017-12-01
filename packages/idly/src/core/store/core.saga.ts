import { Effect, SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import {
  workerGetEntities,
  workerGetFeaturesOfEntityIds
} from '../../worker/main';
import {
  CoreActions,
  selectCommitAction,
  SelectEntitiesAction
} from './core.actions';

import { FeatureTable } from 'idly-common/lib/osm/feature';
import { featureTableGen } from 'idly-common/lib/osm/featureTableGen';

import { Shrub } from 'idly-graph/lib/graph/Shrub';

export function* watchSelect(): SagaIterator {
  yield all([
    takeLatest<SelectEntitiesAction>(CoreActions.SELECT_ENTITIES, selectSaga)
  ]);
}

export function* selectSaga({
  type,
  entityIds
}: SelectEntitiesAction): IterableIterator<Effect> {
  const shrub: Shrub = yield call(workerGetEntities, { entityIds });
  yield put(selectCommitAction(shrub));
}
