import {
  Entity,
  LngLat,
  Node,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { Table } from '../../dataStructures/table';
import { nodeUpdate } from '../pure/nodeUpdate';
import { nodeUpdateParents } from './nodeUpdateParents';

export function nodeMoveOp({
  prevNode,
  newLoc,
  parentWays,
  parentRelationsLookup,
  idGen,
}: {
  prevNode: Node;
  newLoc: LngLat;
  parentWays: Way[];
  parentRelationsLookup: Table<Relation[]>;
  idGen: (e: Entity) => string;
}): Entity[] {
  const newNode = nodeUpdate({ loc: newLoc, id: idGen(prevNode) }, prevNode);
  return [
    newNode,
    ...nodeUpdateParents({
      idGen,
      newNode,
      parentRelationsLookup,
      parentWays,
      prevNode,
    }),
  ];
}
