import { workerGetMoveNode } from './getMoveNode/worker';
import { workerGetQuadkey } from './getQuadkeys/worker';
import { OperationKinds } from './types';

export default {
  [OperationKinds.GetMoveNode]: workerGetMoveNode,
  [OperationKinds.GetQuadkey]: workerGetQuadkey,
};
