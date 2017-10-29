import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';
import { EntityId } from 'idly-common/lib/osm/structures';

import { Tree } from '../graph/Tree';
import { getChannelBuilder } from '../misc/channelBuilder';
import { recursiveLookup } from '../misc/recursiveLookup';
import {
  GetActions,
  Operation,
  WorkerOperation,
  WorkerState,
} from './operationsTypes';

export interface GetEntities {
  readonly type: GetActions.GetEntities;
  readonly request: {
    readonly entityIds: EntityId[];
  };
  readonly response: Tree;
}

/** Main Thread */
export function getEntities(connector: any): Operation<GetEntities> {
  const channel = getChannelBuilder<GetEntities>(connector)(
    GetActions.GetEntities,
  );
  return async request => {
    const json = await channel(request);
    const parsedTree: GetEntities['response'] = Tree.fromString(json);
    return parsedTree;
  };
}

/** Worker Thread */
export function workerGetEntities(
  state: WorkerState,
): WorkerOperation<GetEntities> {
  return async ({ entityIds }) => {
    const entities = entityIds
      .map(id => recursiveLookup(id, state.entityTable))
      .reduce((prev, curr) => prev.concat(curr), [])
      .map(e => [e.id, e]);
    const toReturn: GetEntities['response'] = Tree.fromObject({
      deletedIds: ImSet(),
      entityTable: ImMap(entities),
      knownIds: ImSet(entityIds),
    });
    return toReturn.toString();
  };
}

// function workerGetEntitiesTest(
//   state: WorkerState,
// ): (t: GetEntities['request']) => Promise<GetEntities['response']> {
//   return async ({ entityIds }) => {
//     const entities = entityIds
//       .map(id => recursiveLookup(id, state.entityTable))
//       .reduce((prev, curr) => prev.concat(curr), [])
//       .map(e => [e.id, e]);
//     return Tree.fromObject({
//       deletedIds: ImSet(),
//       entityTable: ImMap(entities),
//       knownIds: ImSet(entityIds),
//     });
//   };
// }

// const request = {
//   async serializer(input: GetEntities['request']): Promise<string> {
//     return JSON.stringify(input);
//   },
//   async deserializer(string: string): Promise<GetEntities['request']> {
//     return JSON.parse(string);
//   },
//   async logic(input: GetEntities['request']): Promise<GetEntities['response']> {
//     return Tree.fromEntities([]);
//   },
// };

// export interface Smartie<T> {
//   readonly type: string;
//   readonly request;
//   readonly response: Tree;
// }

// function connectToWorker(
//   connector: any,
//   type: any,
//   request: any,
//   serializer: any,
//   deserializer: any,
// ): any {
//   const toSend = {
//     request,
//     type,
//   };
//   return connector.postMessage(toSend).catch((e: Error) => {
//     // tslint:disable-next-line:no-expression-statement
//     console.log('Worker Error', e.message);
//     return Promise.reject(e.message);
//   });
// }

// function connectToMain(record: Map<string, any>) {
//   return (type: string, cb: any) => {
//     // tslint:disable-next-line:no-expression-statement
//     record.set(type, cb);
//     return record;
//   };
// }

// const response = {
//   async serializer(input: GetEntities['response']): Promise<string> {
//     return JSON.stringify(input.toJs());
//   },
//   async deserializer(string: string): Promise<GetEntities['response']> {
//     return Tree.fromString(string);
//   },
//   async logic(
//     state: any,
//     { entityIds }: GetEntities['request'],
//   ): Promise<GetEntities['response']> {
//     const entities = entityIds
//       .map(id => recursiveLookup(id, state.entityTable))
//       .reduce((prev, curr) => prev.concat(curr), [])
//       .map(e => [e.id, e]);
//     return Tree.fromObject({
//       deletedIds: ImSet(),
//       entityTable: ImMap(entities),
//       knownIds: ImSet(entityIds),
//     });
//   },
// };
