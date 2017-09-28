import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { workerGetEntities, workerGetFeatures } from '../../worker/main';
import {
  SelectActions,
  selectCommitAction,
  SelectEntitiesAction
} from './select.actions';

import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { FeatureTable } from 'idly-common/lib/osm/feature';
import { featureTableGen } from 'idly-common/lib/osm/featureTableGen';
import { parseJSONFriendlyEntities } from 'idly-common/lib/osm/parseJSONFriendlyEntities';
import { Entity, EntityTable } from 'idly-common/lib/osm/structures';

import { Tree } from 'idly-graph/lib/graph/Tree';
import { WorkerGetEntities, WorkerGetFeatures } from 'idly-worker/lib/actions';

export function* watchSelect(): SagaIterator {
  yield all([
    takeLatest<SelectEntitiesAction>(SelectActions.SELECT_ENTITIES, selectSaga)
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
  const tree = Tree.fromString(response[1].tree); // response[1].tree;
  const featureTable: FeatureTable<any, any> = featureTableGen(features);

  yield put(selectCommitAction(tree, featureTable));
}
