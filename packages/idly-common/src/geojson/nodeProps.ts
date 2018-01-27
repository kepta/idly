import { Set as ImSet } from 'immutable';
import { weakCache2 } from '../misc/weakCache';
import { Node, NodeGeometry, OsmGeometry, Tags } from '../osm/structures';

import { getNodeGeometry } from '../osm/getNodeGeometry';
import { presetMatch } from './presetMatch';

export const DEFAULT_NODE_ICON = 'circle';

export const nodePropertiesGen = weakCache2(
  (node: Node, parentWay: ImSet<string>) => {
    return applyNodeMarkup(getNodeGeometry(parentWay), node.tags);
  }
);

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
