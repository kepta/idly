import { Entity, EntityId } from 'idly-common/lib';
import { BBox } from 'idly-common/lib/geo/bbox';
import { Feature } from 'idly-common/lib/osm/feature';
import { actionBuilderFactory } from 'idly-common/lib/store';

export enum WorkerActions {
  GET_VIRGIN_ENTITIES = 'WorkerActions.GET_VIRGIN_ENTITIES',
  GET_VIRGIN_FEATURES = 'WorkerActions.GET_VIRGIN_FEATURES',
  FETCH_MAP = 'WorkerActions.FETCH_MAP',
  DEFAULT = 'WorkerActions.DEFAULT'
}

/**
 * utility to help type messages
 */

export type WorkerActionsType =
  | WorkerFetchMap
  | WorkerGetEntities
  | WorkerGetFeatures
  | WorkerDefault;

export interface WorkerFetchMap {
  type: WorkerActions.FETCH_MAP;
  request: {
    bbox: BBox;
    zoom: number;
  };
  response?: {
    featureCollection: string;
  };
}

export interface WorkerGetEntities {
  type: WorkerActions.GET_VIRGIN_ENTITIES;
  request: {
    entitiesId: EntityId[];
  };
  response?: {
    entities: Entity[];
  };
}

export interface WorkerGetFeatures {
  type: WorkerActions.GET_VIRGIN_FEATURES;
  request: {
    entitiesId: EntityId[];
  };
  response?: {
    features: Array<Feature<any, any>>;
  };
}

export interface WorkerDefault {
  type: WorkerActions.DEFAULT;
  request: {};
  response?: {};
}
