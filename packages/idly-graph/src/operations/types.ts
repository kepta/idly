import { WorkerGetEntities } from './fetchEntities';
import { WorkerFetchFeatures } from './fetchFeatures';
import { WorkerFetchMap } from './fetchMap';

export enum WorkerActions {
  FetchEntities = 'WorkerActions.FETCH_ENTITIES',
  FetchFeatures = 'WorkerActions.FETCH_FEATURES',
  FetchMap = 'WorkerActions.FETCH_MAP',
  Default = 'WorkerActions.DEFAULT',
}

export interface DefaultCase {
  readonly type: WorkerActions.Default;
  readonly request: any;
}

export type WorkerActionsType =
  | WorkerFetchMap
  | WorkerGetEntities
  | WorkerFetchFeatures
  | DefaultCase;

export type WorkerResponse = string;
