import { WorkerGetEntities } from './fetchEntities';
import { WorkerFetchMap } from './fetchMap';

export enum WorkerActions {
  FetchEntities = 'WorkerActions.FETCH_ENTITIES',
  GetVirginFeatures = 'WorkerActions.GET_VIRGIN_FEATURES',
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
  | DefaultCase;

export type WorkerResponse = string;
