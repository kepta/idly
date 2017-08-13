import { Feature, Point } from 'geojson';
import { Geometry } from 'osm/entities/constants';
import { Tags } from 'osm/entities/helpers/tags';
import { Node } from 'osm/entities/node';
import { ParentWays } from 'osm/parsers/parsers';
import * as R from 'ramda';
import { weakCache } from 'utils/weakCache';

type NodeFeat = Feature<Point>;
type NodeGeometry = Geometry.POINT | Geometry.VERTEX | Geometry.VERTEX_SHARED;

interface INodeMarkup {
  icon: string;
  name?: string;
  geometry: NodeGeometry;
}

export function nodeCombiner(
  node: Node,
  parentWays: ParentWays,
  presetsMatcher: (n: NodeGeometry, t: Tags) => any
) {
  return {
    ...nodeToPoint(node),
    properties: {
      ...applyNodeMarkup(
        presetsMatcher,
        getNodeGeometry(node.id, parentWays),
        node.tags
      )
    }
  };
}

export function nodeToPoint(node: Node): Feature<Point> {
  return {
    id: node.id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [node.loc.lon, node.loc.lat]
    },
    properties: {}
  };
}

export function applyNodeMarkup(
  presetsMatcher: (n: NodeGeometry, t: Tags) => any,
  geometry: NodeGeometry,
  tags: Tags
) {
  const match = presetsMatcher(geometry, tags);
  return {
    icon: (match && match.icon) || 'circle',
    name: tags.get('name'),
    geometry
  };
}

/**
 *  @REVISIT
 *   I am not sure about this,
 *   // mosty holds// 1st if <way><n id=X></way> I should have node X in the same request.
 *   // proved wrong// 2nd if node id=Y I should have all the ways having Y in the same request.
 *
 * @REVISIT
 *  need to test / figure out how to handle 2nd point above ^^.
 *  so this guy at sagas would simply filter away this new node information
 *  wrapped in way coming in any subsequent request. hence our node would
 *  not get the new status or VERTEX_SHARED
 */
export function getNodeGeometry(id, parentWays: ParentWays) {
  if (parentWays.get(id))
    return parentWays.get(id).size > 1
      ? Geometry.VERTEX_SHARED
      : Geometry.VERTEX;
  return Geometry.POINT;
}
