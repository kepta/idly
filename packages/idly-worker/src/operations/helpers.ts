import { OsmState } from 'idly-state/lib/type';

import { OperationTypes } from './types';

export interface WorkerState {
  osmState: OsmState;
}

export type MainOperation<T extends OperationTypes> = (
  req: T['request']
) => Promise<T['response']>;

export type WorkerOperation<T extends OperationTypes> = (
  req: T['request']
) => Promise<{ response: T['response']; state: WorkerState }>;
