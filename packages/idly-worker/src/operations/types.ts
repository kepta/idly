import { GetMoveNode } from './getMoveNode/type';
import { GetQuadkey } from './getQuadkeys/type';
export interface DefaultGetCase {
  readonly type: OperationKinds.GetDefault;
  readonly request: any;
  readonly response: any;
}

export type OperationTypes = GetQuadkey | GetMoveNode | DefaultGetCase;

export enum OperationKinds {
  GetDefault = 'GET_DEFAULT',
  GetQuadkey = 'GET_QUADKEY',
  GetMoveNode = 'GET_MOVENODE',
}
