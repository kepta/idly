import * as turfHelpers from '@turf/helpers';
import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';

import { Tree } from '../graph/Tree';
import { WorkerActions, WorkerActionsType } from './actions';
import { Manager } from './store/manager';

function main() {
  const manager = new Manager(Promise.resolve([]));
  return function messageParsing(
    message: WorkerActionsType,
  ): WorkerActionsType | Promise<WorkerActionsType> {
    switch (message.type) {
      case WorkerActions.FETCH_MAP: {
        const { bbox, zoom } = message.request;
        return manager.receive(bbox, zoom).then(features => ({
          ...message,
          response: {
            featureCollection: JSON.stringify(
              turfHelpers.featureCollection(features),
            ),
          },
        }));
      }
      case WorkerActions.GET_VIRGIN_ENTITIES: {
        const { entityIds } = message.request;
        const tree = new Tree(
          ImSet(entityIds),
          ImMap(manager.entityLookup(entityIds).map(e => [e.id, e])),
        ).toJs();
        return {
          ...message,
          response: {
            tree,
          },
        };
      }
      case WorkerActions.GET_VIRGIN_FEATURES: {
        const { entityIds } = message.request;
        return manager.featureLookup(entityIds).then(features => ({
          ...message,
          response: {
            features,
          },
        }));
      }
      default: {
        console.log('default message', message);
        return message;
      }
    }
  };
}
