// import { Geometry } from 'osm/entities/constants';
// import { Entities } from 'osm/entities/entities';
// import { Node } from 'osm/entities/node';
// import { Way } from 'osm/entities/way';
// import { Graph } from 'osm/history/graph';
// import { ParentWays } from 'osm/parsers/parsers';
// import { presetsMatcher } from 'osm/presets/presets';
// import * as R from 'ramda';
// import { weakCache } from 'utils/weakCache';

// export function entitiesToFeat(
//   graph: Graph,
//   parentWays: ParentWays,
//   data: Entities
// ) {
//   const entities = data
//     .toArray()
//     .map(e => {
//       if (e instanceof Node) {
//         return nodeToFeat(e, parentWays);
//       } else if (e instanceof Way) {
//         return wayToFeat(e, graph);
//       }
//     })
//     .filter(f => f);
// }

// interface INodeProperties {
//   node_properties: string;
//   tags: string;
//   id: string;
//   icon: string;
//   name?: string;
//   geometry: Geometry.POINT | Geometry.VERTEX;
// }

// const curriedPresetsMatch = R.curry(presetsMatcher);

// const presetMatchPoint = weakCache(curriedPresetsMatch(Geometry.POINT));
// const presetMatchVertex = weakCache(curriedPresetsMatch(Geometry.VERTEX));

// export function nodeToFeat(node: Node, parentWays: ParentWays) {
//   const match =
//     node.geometry === Geometry.POINT
//       ? presetMatchPoint(node.tags)
//       : presetMatchVertex(node.tags);
//   const properties: INodeProperties = {
//     node_properties: JSON.stringify(node.properties),
//     tags: JSON.stringify(node.tags),
//     id: node.id,
//     icon: (match && match.icon) || 'circle',
//     name: node.tags.get('name'),
//     geometry: node.geometry
//   };
//   return {
//     id: node.id,
//     type: 'Feature',
//     geometry: {
//       type: 'Point',
//       coordinates: [node.loc.lon, node.loc.lat]
//     },
//     properties
//   };
// }

// /**
//  * @REVIST check which is faster graph, way or way, graph
//  */
// export function wayToFeat(way: Way, graph: Graph) {}
