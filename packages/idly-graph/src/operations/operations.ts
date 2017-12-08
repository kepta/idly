import { Map as ImMap } from 'immutable';

import { weakCache2 } from 'idly-common/lib/misc/weakCache';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';

import { pluginsStub } from '../mocks/pluginsStub';
import { workerGetBbox } from './getBbox/worker';
import { workerGetEntities } from './getEntities/worker';
import { workerGetFeaturesOfEntityIds } from './getFeaturesOfEntityIds/worker';
import { workerGetFeaturesOfShrub } from './getFeaturesOfShrub/worker';
import { workerGetMap } from './getMap/worker';
import {
  GetActions,
  GetActionTypes,
  WorkerSetStateActions,
  WorkerSetStateActionsType,
  WorkerState,
} from './operationsTypes';
import { workerSetOsmTiles } from './setOsmTiles/worker';

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

    case GetActions.getFeaturesOfShrub:
      return workerGetFeaturesOfShrub(state)(message.request);
    case GetActions.GetBbox:
      return workerGetBbox(state)(message.request);
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
  debug?: boolean,
): (message: any) => Promise<any> {
  let state = {
    ...(prevState || DEFAULT_STATE),
    plugins: sanitizePlugins(plugins),
  };
  let x;
  const setStateActions = Object.keys(WorkerSetStateActions);
  return async message => {
    if (debug) {
      console.log('worker--', message);
    }
    const newState = await setStateController(state, message);
    if (state !== newState) {
      state = newState;
      return Promise.resolve('SUCCESS');
    }
    return getStateController(state, message)
      .then(r => {
        if (debug) {
          self.workerState = state;
          console.log('workerstate', JSON.parse(JSON.stringify(state)));
        }
        return r;
      })
      .catch(e => {
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
