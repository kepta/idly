import { EntityId } from 'idly-common/lib/osm/structures';
import { actionBuilderFactory } from 'idly-common/lib/store/action';

import { Tree } from '../graph/Tree';

export enum CoreActionsEnum {
  ReplaceState = 'Core.ReplaceState',
}

export type CoreActionTypes = ReplaceState;

const builder = actionBuilderFactory<CoreActionTypes>();

/**
 * Replaces the core store with the given 
 * selectedIds and tree.
 */
export interface ReplaceState {
  type: CoreActionsEnum.ReplaceState;
  selectedIds: EntityId[];
  tree: Tree;
}

export const CoreActions = {
  ReplaceState: builder<ReplaceState>(CoreActionsEnum.ReplaceState)(
    'selectedIds',
    'tree',
  ),
};
