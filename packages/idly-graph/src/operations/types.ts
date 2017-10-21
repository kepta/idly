import { ImMap } from 'idly-common/lib/misc/immutable';
import {
  Entity,
  EntityId,
  EntityTable,
  ParentWays,
} from 'idly-common/lib/osm/structures';
import { List } from 'immutable';

import { WorkerGetEntities } from './fetchEntities';
import { WorkerFetchMap } from './fetchMap';
import { GetFeaturesOfEntityIds } from './getFeaturesOfEntityIds';
import { WorkerSetOsmTiles } from './setOsmTiles';

export type TilesDataTable = ImMap<string, Promise<TileData> | undefined>;

export interface WorkerState {
  readonly entityTable: EntityTable;
  readonly parentWays: ParentWays;
  readonly tilesDataTable: TilesDataTable;
  readonly plugins: Promise<any>;
}

export interface TileData {
  readonly entities: Entity[];
  readonly entityTable: EntityTable;
  readonly parentWays: ParentWays;
}

/**
 * Get type worker actions
 * These actions access the worker state
 * and cannot modify the state.
 */
export enum WorkerGetStateActions {
  GetEntities = 'WorkerGetState.GET_ENTITIES',
  GetFeaturesOfEntityIds = 'WorkerGetState.GET_FEATURES',
  GetDefault = 'WorkerGetState.GET_DEFAULT',
  FetchMap = 'WorkerGetState.GET_MAP',
}

export interface DefaultGetCase {
  readonly type: WorkerGetStateActions.GetDefault;
  readonly request: any;
}

export type WorkerGetStateActionsType =
  | WorkerGetEntities
  | GetFeaturesOfEntityIds
  | WorkerFetchMap
  | DefaultGetCase;

export type WorkerGetResponse = string;

/**
 * Set type actions
 * These actions change the state of the worker
 * and do not necessarily reply with data
 */
export enum WorkerSetStateActions {
  SetOsmTiles = 'WorkerSetState.SET_OSM_TILES',
  SetHideEntities = 'WorkerSetState.SET_HIDE_ENTITIES',
  SetDefault = 'WorkerSetState.SET_DEFAULT',
}

export interface DefaultSetCase {
  readonly type: WorkerSetStateActions.SetDefault;
  readonly request: any;
}

export type WorkerSetStateActionsType = WorkerSetOsmTiles | DefaultSetCase;

export type WorkerSetResponse = string;
