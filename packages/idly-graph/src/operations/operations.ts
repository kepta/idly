import { ImMap } from 'idly-common/lib/misc/immutable';
import { weakCache2 } from 'idly-common/lib/misc/weakCache';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';

import { pluginsStub } from '../misc/pluginsStub';
import { workerFetchEntities } from './fetchEntities';
import { workerFetchFeatures } from './fetchFeatures';
import { workerFetchMap } from './fetchMap';
import { workerSetOsmTiles } from './setOsmTiles';
import {
    WorkerGetStateActions,
    WorkerGetStateActionsType,
    WorkerSetStateActions,
    WorkerSetStateActionsType,
    WorkerState,
} from './types';

const DEFAULT_STATE: WorkerState = {
  entityTable: entityTableGen(),
  parentWays: ImMap(),
  plugins: pluginsStub(),
  tilesDataTable: ImMap(),
};

function getStateController(
  state: WorkerState,
  message: WorkerGetStateActionsType,
): Promise<string> {
  switch (message.type) {
    // @TOFIX convert this to a dynamic rather than a static one
    // or should i?
    // case WorkerGetStateActions.FetchMap:
    //   return workerFetchMap(state)(message.request);
    case WorkerGetStateActions.FetchMap: {
      return workerFetchMap(state)(message.request);
    }
    case WorkerGetStateActions.GetEntities:
      return workerFetchEntities(state)(message.request);
    case WorkerGetStateActions.GetFeatures:
      return workerFetchFeatures(state)(message.request);
    default: {
      console.error('no get handler for', message.type);
      return Promise.resolve(message.type);
    }
  }
}

function setStateController(
  state: WorkerState,
  message: WorkerSetStateActionsType,
): Promise<WorkerState> {
  switch (message.type) {
    case WorkerSetStateActions.SetOsmTiles: {
      return workerSetOsmTiles(state)(message.request);
    }
    default: {
      return Promise.resolve(state);
    }
  }
}

/**
 * wraps the Promise<string> to the shape of `WorkerResponse`,
 * this helps in sending errors to main thread and also prevents
 * promise works JSON.parse and lets you handle custom JSON parsing
 * of certain objects like immutable, Tree etc.
 * @param message
 */
export function operations(
  plugins: Promise<any>,
  prevState?: WorkerState,
): (message: any) => Promise<any> {
  let state = {
    ...(prevState || DEFAULT_STATE),
    plugins: sanitizePlugins(plugins),
  };
  const setStateActions = Object.keys(WorkerSetStateActions);
  return async message => {
    const newState = await setStateController(state, message);
    if (state !== newState) {
      // tslint:disable-next-line:no-expression-statement
      state = newState;
      return Promise.resolve('SUCCESS');
    }
    return getStateController(state, message).catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
  };
}

function sanitizePlugins(plugins: Promise<any>): Promise<any> {
  return plugins.then(plugs => {
    if (!plugs) {
      console.error('empty plugin promise');
      return [];
    }
    return plugs.workers.map(w => {
      if (!w || !w.worker || !w.pluginName) throw new Error('empty worker');
      return {
        ...w,
        worker: weakCache2(w.worker),
      };
    });
  });
}
