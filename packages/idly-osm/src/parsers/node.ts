import {
  Node,
  NodeGeometry,
  ParentWays,
  Tags,
  OsmGeometry
} from 'idly-common/lib/osm/structures';
import { getNodeGeometry } from '../helpers/getNodeGeometry';

import { presetsMatcherCached } from '../presets/presets';

export const DEFAULT_NODE_ICON = 'circle';

export function nodePropertiesGen(node: Node, parentWays: ParentWays) {
  return applyNodeMarkup(getNodeGeometry(node.id, parentWays), node.tags);
}

export const applyNodeMarkup = (geometry: NodeGeometry, tags: Tags) => {
  const match = presetsMatcherCached(geometry)(tags);
  return {
    icon: (match && match.icon) || DEFAULT_NODE_ICON,
    name: tags.get('name'),
    geometry
  };
};
