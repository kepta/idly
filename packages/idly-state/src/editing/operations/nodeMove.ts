import { relationFactory, wayFactory } from 'idly-common/lib/osm/entityFactory';
import {
  Entity,
  LngLat,
  Node,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { Table } from '../../table';
import { nodeUpdate } from '../helpers/nodeUpdate';
import { nodeUpdateParentWays } from '../helpers/nodeUpdateParentWays';
import { wayUpdateNodeId } from '../helpers/wayUpdateNodeId';
import { nodeUpdateParents } from './nodeUpdateParents';

export function nodeMove(
  prevNode: Node,
  newLoc: LngLat,
  parentWaysTable: Table<Way[]>,
  parentRelationsTable: Table<Relation[]>,
  idGen: (e: Entity) => string
): Entity[] {
  const newNode = nodeUpdate({ loc: newLoc, id: idGen(prevNode) }, prevNode);
  return [
    newNode,
    ...nodeUpdateParents(
      prevNode,
      newNode,
      parentWaysTable,
      parentRelationsTable,
      idGen
    ),
  ];
}
