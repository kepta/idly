import { Feature, Point } from 'geojson';
import { Geometry } from 'osm/entities/constants';
import { getNodeGeometry } from 'osm/entities/helpers/misc';
import { Tags } from 'osm/entities/helpers/tags';
import { Node } from 'osm/entities/node';
import { ParentWays } from 'osm/parsers/parsers';
import { presetsMatcherCached } from 'osm/presets/presets';
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