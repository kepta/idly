import { workerGetEntity } from './getEntity/worker';
import { workerGetEntityMetadata } from './getEntityMetadata/worker';
import { workerGetMoveNode } from './getMoveNode/worker';
import { workerGetQuadkey } from './getQuadkey/worker';
import { OperationKinds } from './types';

export default {
  [OperationKinds.GetEntity]: workerGetEntity,
  [OperationKinds.GetEntityMetadata]: workerGetEntityMetadata,
  [OperationKinds.GetMoveNode]: workerGetMoveNode,
  [OperationKinds.GetQuadkey]: workerGetQuadkey,
};
