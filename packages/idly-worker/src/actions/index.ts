import { BBox } from 'idly-common/lib/geo/bbox';
import { Feature } from 'idly-common/lib/osm/feature';
import { JSONFriendlyEntities } from 'idly-common/lib/osm/makeJSONFriendlyEntities';
import { Entity, EntityId, Node } from 'idly-common/lib/osm/structures';

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
    entityIds: EntityId[];
  };
  response?: {
    entities: JSONFriendlyEntities;
  };
}

export interface WorkerGetFeatures {
  type: WorkerActions.GET_VIRGIN_FEATURES;
  request: {
    entityIds: EntityId[];
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
