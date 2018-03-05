import { OsmState } from 'idly-state/lib/osmState';
import { GetMoveNode } from './getMoveNode/type';
import { GetQuadkey } from './getQuadkeys/type';
import { SetMovePointEntry } from './setMovePointEntry/type';

export interface WorkerState {
  osmState: OsmState;
}

export type MainOperation<T extends OperationTypes> = (
  req: T['request']
) => Promise<T['response']>;

export type WorkerOperation<T extends OperationTypes> = (
  req: T['request']
) => Promise<{ response: T['response']; state: WorkerState }>;

/**
 * Get type worker actions
 * These actions access the worker state
 * and cannot modify the state.
 */
export enum OperationKinds {
  GetQuadkey = 'GET_QUADKEY',
  GetMoveNode = 'GET_MOVENODE',
  SetMovePointEntry = 'SET_MOVE_POINT_ENTRY',
  GetDefault = 'GET_DEFAULT',
}

export interface DefaultGetCase {
  readonly type: OperationKinds.GetDefault;
  readonly request: any;
  readonly response: any;
}

export type OperationTypes =
  | GetQuadkey
  | GetMoveNode
  | SetMovePointEntry
  | DefaultGetCase;
