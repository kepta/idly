import * as turfHelpers from '@turf/helpers';
import { WorkerActions, WorkerActionsType } from './actions';
import { Manager } from './store/manager';

const manager = new Manager();

export function main(
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
      const { entitiesId } = message.request;
      const entities = manager.entityLookup(entitiesId);
      return {
        ...message,
        response: {
          entities
        }
      };
    }
    case WorkerActions.GET_VIRGIN_FEATURES: {
      const { entitiesId } = message.request;
      const features = manager.featureLookup(entitiesId);
      return {
        ...message,
        response: {
          features
        }
      };
    }
    default: {
      console.log(message.request);
      return;
    }
  }
}
