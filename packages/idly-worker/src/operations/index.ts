import { workerGetMoveNode } from './getMoveNode/worker';
import { workerGetQuadkey } from './getQuadkeys/worker';
import { OperationKinds } from './operationsTypes';
import { workerSetMovePointEntry } from './setMovePointEntry/worker';

export default {
  [OperationKinds.GetMoveNode]: workerGetMoveNode,
  [OperationKinds.GetQuadkey]: workerGetQuadkey,
  [OperationKinds.SetMovePointEntry]: workerSetMovePointEntry,
};
