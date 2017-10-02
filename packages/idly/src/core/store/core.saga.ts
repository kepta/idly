import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { workerGetEntities, workerGetFeatures } from '../../worker/main';
import {
  CoreActions,
  selectCommitAction,
  SelectEntitiesAction
} from './core.actions';

import { FeatureTable } from 'idly-common/lib/osm/feature';
import { featureTableGen } from 'idly-common/lib/osm/featureTableGen';

import { Tree } from 'idly-graph/lib/graph/Tree';
import { WorkerGetEntities, WorkerGetFeatures } from 'worker/actions';

export function* watchSelect(): SagaIterator {
  yield all([
    takeLatest<SelectEntitiesAction>(CoreActions.SELECT_ENTITIES, selectSaga)
  ]);
}

export function* selectSaga({ type, entityIds }: SelectEntitiesAction) {
  const response: [
    WorkerGetFeatures['response'],
    WorkerGetEntities['response']
  ] = yield all([
    call(workerGetFeatures, {
      entityIds
    }),
    call(workerGetEntities, {
      entityIds
    })
  ]);

  const features = response[0].features;
  const tree = Tree.fromString(response[1].tree);
  const featureTable: FeatureTable<any, any> = featureTableGen(features);

  yield put(selectCommitAction(tree, featureTable));
}
