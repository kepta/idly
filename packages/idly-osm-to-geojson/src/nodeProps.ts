import {
  Node,
  NodeGeometry,
  OsmGeometry,
  Tags,
} from 'idly-common/lib/osm/structures';

import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { getNodeGeometry } from './getNodeGeometry';

export const DEFAULT_NODE_ICON = 'circle';

export const nodePropertiesGen = (node: Node, parentWay: Set<string>) => {
  return applyNodeMarkup(getNodeGeometry(parentWay), node.tags);
};

export const nodePropertiesGenNew = (node: Node, parentWay: Set<string>) => {
  return applyNodeMarkup(
    parentWay.size === 0 ? OsmGeometry.POINT : OsmGeometry.VERTEX,
    node.tags
  );
};

export const applyNodeMarkup = (
  geometry: NodeGeometry,
  tags: Tags
): {
  icon: string;
  name: string;
  geometry: OsmGeometry;
} => {
  const match = presetMatch(tags, geometry);
  return {
    geometry,
    icon: (match && match.icon) || DEFAULT_NODE_ICON,
    name: tags.name,
  };
};
