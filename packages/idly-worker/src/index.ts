import { getMoveNode } from './operations/getMoveNode/main';
import { GetMoveNode } from './operations/getMoveNode/type';
import { getQuadkey } from './operations/getQuadkeys/main';
import { GetQuadkey } from './operations/getQuadkeys/type';
import { MainOperation } from './operations/helpers';

export interface WorkerType {
  getMoveNode: MainOperation<GetMoveNode>;
  getQuadkeys: MainOperation<GetQuadkey>;
}

export default function(promiseWorker: any): WorkerType {
  return {
    getMoveNode: getMoveNode(promiseWorker),
    getQuadkeys: getQuadkey(promiseWorker),
  };
}
