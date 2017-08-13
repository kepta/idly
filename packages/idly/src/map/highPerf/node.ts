import { Feature, Point } from 'geojson';
import { Set } from 'immutable';
import { Geometry } from 'osm/entities/constants';
import { Tags } from 'osm/entities/helpers/tags';
import { Node } from 'osm/entities/node';
import { ParentWays } from 'osm/parsers/parsers';
import { presetsMatcher, presetsMatcherCached } from 'osm/presets/presets';
import * as R from 'ramda';
import { weakCache, weakCache2 } from 'utils/weakCache';
type NodeFeat = Feature<Point>;
type NodeGeometry = Geometry.POINT | Geometry.VERTEX | Geometry.VERTEX_SHARED;

interface INodeMarkup {
  icon: string;
  name?: string;
  geometry: NodeGeometry;
}
export const DEFAULT_NODE_ICON = 'circle';

export function nodeCombiner(node: Node, parentWays: ParentWays) {
  return {
    ...nodeToPoint(node),
    properties: {
      ...applyNodeMarkup(
        // presetsMatcher,
        getNodeGeometry(node.id, parentWays),
        node.tags
      ),
      id: node.id
    }
  };
}

export const nodeToPoint = (node: Node): Feature<Point> => {
  return {
    id: node.id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [node.loc.lon, node.loc.lat]
    },
    properties: {}
  };
};

export const applyNodeMarkup = (geometry: NodeGeometry, tags: Tags) => {
  const match = presetsMatcherCached(geometry)(tags);
  return {
    icon: (match && match.icon) || DEFAULT_NODE_ICON,
    name: tags.get('name'),
    geometry
  };
};

/**
 * @NOTE
 *  The way osm works is that it will give you everything inside the bbox
 *   but only a secondary level outside the bbox. So if the a node is
 *   currently a vertex, it could become a vertex_shared in future.
 *   thats why parentWays is updated on every network request.
 */
export function getNodeGeometry(id, parentWays: ParentWays) {
  if (parentWays.has(id))
    return parentWays.get(id).size > 1
      ? Geometry.VERTEX_SHARED
      : Geometry.VERTEX;
  return Geometry.POINT;
}
