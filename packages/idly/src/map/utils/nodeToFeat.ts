import { Point } from 'geojson';
import * as turf from 'turf';

import { Feature } from 'typings/geojson';

import { Node } from 'osm/entities/node';
import { initAreaKeys, initPresets, presetsMatch } from 'osm/presets/presets';

import { weakCache } from 'utils/weakCache';

interface INodeProperties {
  node_properties: string;
  tags: string;
  id: string;
  icon: string;
  name?: string;
  geometry: string;
}
/**
 * @TOFIX this whole Nodeproperties fuck up
 *  the typings dont support properties
 */
export type NodeFeature = Feature<Point, INodeProperties>;
const { collection } = initPresets();
const areaKeys = initAreaKeys(collection);
function _nodeToFeat(n: any): NodeFeature {
  if (n instanceof Node) {
    const match = presetsMatch(n, areaKeys);
    const properties: INodeProperties = {
      node_properties: JSON.stringify(n.properties),
      tags: JSON.stringify(n.tags),
      id: n.id,
      icon: match && match.icon,
      name: n.tags.get('name'),
      geometry: n.properties.geometry
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
