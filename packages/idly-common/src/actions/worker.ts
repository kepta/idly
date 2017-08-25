import { Entity } from '../osm';
import { actionBuilderFactory } from '../store';
import { BBox } from '../geo/bbox';
import { EntityId } from '../';

export enum WorkerActions {
  GET_VIRGIN_ENTITIES = 'ToWorkerActions.GET_VIRGIN_ENTITIES',

  FETCH_MAP = 'ToWorkerActions.FETCH_MAP',
  DEFAULT = 'ToWorkerActions.DEFAULT'
}

export interface WorkerFetchMap {
  type: WorkerActions.FETCH_MAP;
  uid: string;
  bbox: BBox;
  zoom: number;
}

export interface WorkerGetEntities {
  type: WorkerActions.GET_VIRGIN_ENTITIES;
  uid: string;
  entitiesId: EntityId[];
  response?: {
    entities: Entity[];
  };
}

export interface WorkerDefault {
  type: WorkerActions.DEFAULT;
  uid: string;
}

export type WorkerActionsType =
  | WorkerGetEntities
  | WorkerFetchMap
  | WorkerDefault;

const workerActionBuilder = actionBuilderFactory<WorkerActionsType>();

export const workerFetchMapAction = workerActionBuilder<WorkerFetchMap>(
  WorkerActions.FETCH_MAP
)('bbox', 'zoom');

export const workerGetEntitiesAction = workerActionBuilder<WorkerGetEntities>(
  WorkerActions.GET_VIRGIN_ENTITIES
)('entitiesId');
