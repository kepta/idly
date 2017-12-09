import { Way } from '../../../osm/structures';

/**
 * Adds a node (id) in front of the node which is currently at position index.
 * If index is undefined, the node will be added to the end of the way for linear ways,
 * or just before the final connecting node for circular ways.
 * Consecutive duplicates are eliminated including existing ones.
 * Circularity is always preserved when adding a node.
 * ref: https://github.com/openstreetmap/iD/blob/master/modules/osm/way.js#L250
 * @param way
 * @param index
 */
// export function wayAddNode(way: Way, index: number): Way {
//   let nodes = way.nodes.slice();
//   const isClosed = wayIsClosed(way);
//   const max = isClosed ? nodes.length - 1 : nodes.length;

//   if (index === undefined) {
//     index = max;
//   }

//   if (index < 0 || index > max) {
//     throw new RangeError('index ' + index + ' out of range 0..' + max);
//   }

//   // If this is a closed way, remove all connector nodes except the first one
//   // (there may be duplicates) and adjust index if necessary..
//   if (isClosed) {
//     const connector = nodes[0];

//     // leading connectors..
//     let i = 1;
//     while (i < nodes.length && nodes.length > 2 && nodes[i] === connector) {
//       nodes.splice(i, 1);
//       if (index > i) {
//         index--;
//       }
//     }

//     // trailing connectors..
//     i = nodes.length - 1;
//     while (i > 0 && nodes.length > 1 && nodes[i] === connector) {
//       nodes.splice(i, 1);
//       if (index > i) {
//         index--;
//       }
//       i = nodes.length - 1;
//     }
//   }

//   nodes.splice(index, 0, id);
//   nodes = nodes.filter(noRepeatNodes);

//   // If the way was closed before, append a connector node to keep it closed..
//   if (
//     isClosed &&
//     (nodes.length === 1 || nodes[0] !== nodes[nodes.length - 1])
//   ) {
//     nodes.push(nodes[0]);
//   }

//   return this.update({ nodes });
// }
