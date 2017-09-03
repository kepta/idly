import * as turfHelpers from '@turf/helpers';
import {
  WorkerActions,
  WorkerActionsType,
  WorkerDefault,
  WorkerFetchMap,
  WorkerGetEntities,
  WorkerGetFeatures
} from './actions';
import { Manager } from './store/manager';

export function main(plugins) {
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
        const entities = manager.entityLookup(entityIds);
        return {
          ...message,
          response: {
            entities
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
