import { List } from 'immutable';
import { workerGetFeaturesOfTree } from './getFeaturesOfTree';

import { ImMap } from 'idly-common/lib/misc/immutable';
import { weakCache2 } from 'idly-common/lib/misc/weakCache';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';

import { pluginsStub } from '../misc/pluginsStub';
import { workerGetEntities } from './getEntities';
import { workerGetFeaturesOfEntityIds } from './getFeaturesOfEntityIds';
import { workerGetMap } from './getMap';
import {
  GetActions,
  GetActionTypes,
  WorkerSetStateActions,
  WorkerSetStateActionsType,
  WorkerState,
} from './operationsTypes';
import { workerSetOsmTiles } from './setOsmTiles';

const DEFAULT_STATE: WorkerState = {
  entityTable: entityTableGen(),
  parentWays: ImMap(),
  plugins: pluginsStub(),
  tilesDataTable: ImMap(),
};

function getStateController(
  state: WorkerState,
  message: GetActionTypes,
): Promise<string> {
  switch (message.type) {
    // @TOFIX convert this to a dynamic rather than a static one
    // or should i?
    // case WorkerGetStateActions.FetchMap:
    //   return workerFetchMap(state)(message.request);
    case GetActions.GetMap:
      return workerGetMap(state)(message.request);

    case GetActions.GetEntities:
      return workerGetEntities(state)(message.request);

    case GetActions.GetFeaturesOfEntityIds:
      return workerGetFeaturesOfEntityIds(state)(message.request);

    case GetActions.GetFeaturesOfTree:
      return workerGetFeaturesOfTree(state)(message.request);

    default: {
      // tslint:disable-next-line:no-expression-statement
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
      // tslint:disable-next-line:no-expression-statement
      console.error(e);
      return Promise.reject(e);
    });
  };
}

function sanitizePlugins(plugins: Promise<any>): Promise<any> {
  return plugins.then(plugs => {
    if (!plugs) {
      // tslint:disable-next-line:no-expression-statement
      console.error('empty plugin promise');
      return [];
    }
    return plugs.workers.map((w: any) => {
      if (!w || !w.worker || !w.pluginName) {
        throw new Error('empty worker');
      }
      return {
        ...w,
        worker: weakCache2(w.worker),
      };
    });
  });
}
