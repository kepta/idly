import { Set as ImSet } from 'immutable';
import { weakCache2 } from '../misc/weakCache';
import {
  Node,
  EntityType,
  NodeGeometry,
  ParentWays,
  Tags,
  OsmGeometry,
} from '../osm/structures';

import { presetMatch } from './presetsMatch';
import { getNodeGeometry } from '../osm/getNodeGeometry';

export const DEFAULT_NODE_ICON = 'circle';

export const nodePropertiesGen = weakCache2(
  (node: Node, parentWay: ImSet<string>) => {
    return applyNodeMarkup(getNodeGeometry(node.id, parentWay), node.tags);
  },
);

export const applyNodeMarkup = (geometry: NodeGeometry, tags: Tags) => {
  const match = presetMatch(tags, geometry); //presetsMatcherCached(geometry)(tags);
  return {
    icon: (match && match.icon) || DEFAULT_NODE_ICON,
    name: tags['name'],
    geometry,
  };
};
