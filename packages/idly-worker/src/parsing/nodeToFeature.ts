import { Feature, Point } from 'geojson';

import { getNodeGeometry } from 'helpers/getNodeGeometry';
import { ParentWays } from 'parsing/parser';
import { presetsMatcherCached } from 'presets/presets';
import { Geometry } from 'structs/geometry';
import { Node } from 'structs/node';
import { Tags } from 'structs/tags';

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
