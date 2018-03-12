const ops = [['Get', 'Quadkey'], ['Get', 'MoveNode']];

function createAllTypes() {
  const createImports = ([f, l]) =>
    `import { ${f + l} } from './${f.toLowerCase() + l}/type';`;

  const createOperationTypes = ([f, l]) => `${f + l}`;

  const createEnum = ([f, l]) =>
    `${f + l} = '${f.toUpperCase()}_${l.toUpperCase()}'`;

  const typeFile = `
${ops.map(createImports).join('\n    ')}

export interface DefaultGetCase {
    readonly type: OperationKinds.GetDefault;
    readonly request: any;
    readonly response: any;
}

export type OperationTypes = ${ops
    .map(createOperationTypes)
    .join(' | ')} | DefaultGetCase;

export enum OperationKinds {
    GetDefault = 'GET_DEFAULT',
    ${ops.map(createEnum).join(',\n        ')}
}
`;

  return typeFile;
}

function mainFile([f, l]) {
  const file = `
import { parseResponse } from '../../misc/channelBuilder';
import { MainOperation } from '../helpers';
import { OperationKinds } from '../types';
import { ${f + l} } from './type';

export const ${f.toLowerCase() + l}: (con: any) => MainOperation< ${f + l}> = (
    connector: any
) => parseResponse(connector, OperationKinds.${f + l});
`;
  return file;
}

function typeFile([f, l]) {
  const t = `
import { OperationKinds } from '../types';

export interface ${f + l} {
  readonly type: OperationKinds.${f + l};
  readonly request: {
      readonly p1: string;
  };
  readonly response: Array<string>;
}
`;
  return t;
}

function workerFile([f, l]) {
  const t = `
  import { WorkerOperation, WorkerState } from '../helpers';
  import { ${f + l} } from './type';
  
  export function worker${f + l}(
    state: WorkerState
  ): WorkerOperation<${f + l}> {
    return async {p1} => {
      return {
        response: p1 + p1,
        state: {
          ...state,
          osmState: qState,
        },
      };
    };
  }
`;
  return t;
}

console.log(createAllTypes());
// console.log(ops.map(mainFile));
console.log(ops.map(workerFile)[0]);
