
import { workerGetEntity } from './getEntity/worker'
import { workerGetMoveNode } from './getMoveNode/worker'
import { workerGetQuadkey } from './getQuadkey/worker';
import { OperationKinds } from './types';

export default {
  [OperationKinds.GetEntity]: workerGetEntity,
  [OperationKinds.GetMoveNode]: workerGetMoveNode,
  [OperationKinds.GetQuadkey]: workerGetQuadkey
};
