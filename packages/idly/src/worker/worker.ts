import * as turfHelpers from '@turf/helpers';
import { Tree } from 'idly-graph/lib/graph/Tree';
import { plugins } from 'plugins';
import registerPromiseWorker from 'promise-worker/register';

import {
  WorkerActions,
  WorkerActionsType
} from './actions';
import { Manager } from './store/manager';

registerPromiseWorker(main());

function main() {
  const manager = new Manager(plugins);
  return function messageParsing(
    message: WorkerActionsType
  ): WorkerActionsType | Promise<WorkerActionsType> {
    switch (message.type) {
      case WorkerActions.FETCH_MAP: {
        const { bbox, zoom } = message.request;
        return manager.receive(bbox, zoom).then(features => ({
          ...message,
          response: {
            featureCollection: JSON.stringify(
              turfHelpers.featureCollection(features)
            )
          }
        }));
      }
      case WorkerActions.GET_VIRGIN_ENTITIES: {
        const { entityIds } = message.request;
        const tree = Tree.fromObject({
          knownIds: entityIds,
          entities: manager.entityLookup(entityIds)
        }).toJSON();
        return {
          ...message,
          response: {
            tree
          }
        };
      }
      case WorkerActions.GET_VIRGIN_FEATURES: {
        const { entityIds } = message.request;
        return manager.featureLookup(entityIds).then(features => ({
          ...message,
          response: {
            features
          }
        }));
      }
      default: {
        console.log('default message', message);
        return message;
      }
    }
  };
}
