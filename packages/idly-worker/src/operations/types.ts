
import { GetEntity } from './getEntity/type';
    import { GetMoveNode } from './getMoveNode/type';
    import { GetQuadkey } from './getQuadkey/type';

export interface DefaultGetCase {
    readonly type: OperationKinds.GetDefault;
    readonly request: any;
    readonly response: any;
}

export type OperationTypes = GetEntity | GetMoveNode | GetQuadkey | DefaultGetCase;

export enum OperationKinds {
    GetDefault = 'GET_DEFAULT',
    GetEntity = 'GET_ENTITY',
        GetMoveNode = 'GET_MOVENODE',
        GetQuadkey = 'GET_QUADKEY'
}
