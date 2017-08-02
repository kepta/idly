import { Point } from 'geojson';
import * as turf from 'turf';

import { Node } from 'osm/entities/node';
import { ITags } from 'osm/entities/helpers/tags';
import { presetsMatch } from 'osm/presets/presets';
import { Feature } from 'typings/geojson';
import { weakCache } from 'utils/weakCache';

interface INodeProperties {
  node_properties: string;
  tags: string;
  id: string;
  icon: string;
}
/**
 * @TOFIX this whole Nodeproperties fuck up
 *  the typings dont support properties
 */
export type NodeFeature = Feature<Point, INodeProperties>;

function _nodeToFeat(n: any): NodeFeature {
  if (n instanceof Node) {
    const match = presetsMatch(n);
    const properties: INodeProperties = {
      node_properties: JSON.stringify(n.properties),
      tags: JSON.stringify(n.tags),
      id: n.id,
      icon: (match && match.icon) || 'circle'
    };
    const feat = turf.point([n.loc.lon, n.loc.lat], properties) as Feature<
      Point,
      INodeProperties
    >;
    feat.id = n.id;
    return feat;
  }
}

export const nodeToFeat = weakCache(_nodeToFeat);
