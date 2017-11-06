import { presetMatch } from './presetsInit';
import { weakCache2 } from 'idly-common/lib/misc/weakCache';
import {
  Node,
  EntityType,
  NodeGeometry,
  ParentWays,
  Tags,
  OsmGeometry
} from 'idly-common/lib/osm/structures';
import { getNodeGeometry } from '../helpers/getNodeGeometry';

import { Set as ImSet } from 'immutable';

export const DEFAULT_NODE_ICON = 'circle';

export const nodePropertiesGen = weakCache2(
  (node: Node, parentWay: ImSet<string>) => {
    return applyNodeMarkup(getNodeGeometry(node.id, parentWay), node.tags);
  }
);

export const applyNodeMarkup = (geometry: NodeGeometry, tags: Tags) => {
  const match = presetMatch(tags, geometry); //presetsMatcherCached(geometry)(tags);
  return {
    icon: (match && match.icon) || DEFAULT_NODE_ICON,
    name: tags['name'],
    geometry
  };
};
