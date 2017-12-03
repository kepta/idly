import { Map as ImMap } from 'immutable';

import {
  Entity,
  EntityTable,
  ParentWays,
} from 'idly-common/lib/osm/structures';

import { GetFeaturesOfEntityIds } from './getFeaturesOfEntityIds/type';
import { GetMap } from './getMap/type';
import { GetEntities } from './getEntities/type';
import { GetFeaturesOfShrub } from './getFeaturesOfShrub/type';
import { WorkerSetOsmTiles } from './setOsmTiles/type';

export type TilesDataTable = ImMap<string, Promise<TileData> | undefined>;

/**
 * This is an abstraction of the entire main to worker thread.
 * The 'request' allows to type to accepted param and 'response'
 * allows to type to generated response by the worker.
 * Note: only use serializable types, hence do not use Map, Set etc.
 */
export type Operation<T extends GetActionTypes> = (
  req: T['request'],
) => Promise<T['response']>;

/**
 * You would want to return string because anything going out of webworker
 * to main thread needs to be serializable.
 */
export type WorkerOperation<T extends GetActionTypes> = (
  req: T['request'],
) => Promise<string>;

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
export enum GetActions {
  GetEntities = 'GET_ENTITIES',
  GetFeaturesOfEntityIds = 'GET_FEATURES_OF_ENTITY_IDS',
  getFeaturesOfShrub = 'GET_FEATURES_OF_TREE',
  GetDefault = 'GET_DEFAULT',
  GetMap = 'GET_MAP',
}

export interface DefaultGetCase {
  readonly type: GetActions.GetDefault;
  readonly request: any;
  readonly response: any;
}

export type GetActionTypes =
  | GetEntities
  | GetFeaturesOfEntityIds
  | GetFeaturesOfShrub
  | GetMap
  | DefaultGetCase;

/**
 * ======= SET =========
 */

/**
 * Set type actions
 * These actions change the state of the worker
 * and do not necessarily reply with data
 */
export enum WorkerSetStateActions {
  SetOsmTiles = 'SET_OSM_TILES',
  SetHideEntities = 'SET_HIDE_ENTITIES',
  SetDefault = 'SET_DEFAULT',
}

export interface DefaultSetCase {
  readonly type: WorkerSetStateActions.SetDefault;
  readonly request: any;
}

export type WorkerSetStateActionsType = WorkerSetOsmTiles | DefaultSetCase;

export type WorkerSetResponse = string;
