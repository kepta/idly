import { Manager } from '../worker/store/manager';
import { workerFetchEntities } from './fetchEntities';
import { workerFetchFeatures } from './fetchFeatures';
import { workerFetchMap } from './fetchMap';
import { WorkerActions, WorkerActionsType } from './types';

function controller(
  manager: Manager,
  message: WorkerActionsType,
): Promise<string> {
  switch (message.type) {
    // @TOFIX convert this to a dynamic rather than a static one
    // or should i?
    case WorkerActions.FetchMap:
      return workerFetchMap(manager)(message.request);
    case WorkerActions.FetchEntities:
      return workerFetchEntities(manager)(message.request);
    case WorkerActions.FetchFeatures:
      return workerFetchFeatures(manager)(message.request);
    default: {
      console.error('no handler for', message.type);
      return Promise.resolve(message.type);
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
): (message: WorkerActionsType) => Promise<any> {
  const manager = new Manager(plugins);
  return message => {
    return controller(manager, message);
  };
}
