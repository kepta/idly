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

import { Tree } from 'idly-graph/lib/graph/Tree';

export function* watchSelect(): SagaIterator {
  yield all([
    takeLatest<SelectEntitiesAction>(CoreActions.SELECT_ENTITIES, selectSaga)
  ]);
}

export function* selectSaga({
  type,
  entityIds
}: SelectEntitiesAction): IterableIterator<Effect> {
  const tree: Tree = yield call(workerGetEntities, { entityIds });
  const features = yield call(workerGetFeaturesOfEntityIds, { entityIds });
  const featureTable: FeatureTable<any, any> = featureTableGen(features);
  yield put(selectCommitAction(tree, featureTable));
}
