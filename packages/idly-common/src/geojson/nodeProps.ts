import { Set as ImSet } from 'immutable';
import { weakCache2 } from '../misc/weakCache';
import { Node, NodeGeometry, Tags } from '../osm/structures';

import { getNodeGeometry } from '../osm/getNodeGeometry';
import { presetMatch } from './presetMatch';

export const DEFAULT_NODE_ICON = 'circle';

export const nodePropertiesGen = weakCache2(
  (node: Node, parentWay: ImSet<string>) => {
    return applyNodeMarkup(getNodeGeometry(node.id, parentWay), node.tags);
  },
);

export const applyNodeMarkup = (geometry: NodeGeometry, tags: Tags) => {
  const match = presetMatch(tags, geometry);
  return {
    icon: (match && match.icon) || DEFAULT_NODE_ICON,
    name: tags.name,
    geometry,
  };
};
