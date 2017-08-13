import { Point } from 'geojson';
import * as R from 'ramda';
import * as turf from 'turf';

import { Feature } from 'typings/geojson';

import { Geometry } from 'osm/entities/constants';
import { Node } from 'osm/entities/node';
import { presetsMatcher } from 'osm/presets/presets';

import { weakCache } from 'utils/weakCache';

interface INodeProperties {
  node_properties: string;
  tags: string;
  id: string;
  icon: string;
  name?: string;
  geometry: Geometry.POINT | Geometry.VERTEX;
}
/**
 * @TOFIX this whole NodeProperties fuck up
 *  the typings dont support properties
 */
export type NodeFeature = Feature<Point, INodeProperties>;

const curriedPresetsMatch = R.curry(presetsMatcher);

const presetMatchPoint = weakCache(curriedPresetsMatch(Geometry.POINT));
const presetMatchVertex = weakCache(curriedPresetsMatch(Geometry.VERTEX));

function _nodeToFeat(n: any): NodeFeature {
  if (n instanceof Node) {
    const match =
      n.geometry === Geometry.POINT
        ? presetMatchPoint(n.tags)
        : presetMatchVertex(n.tags);

    const properties: INodeProperties = {
      node_properties: JSON.stringify(n.properties),
      tags: JSON.stringify(n.tags),
      id: n.id,
      icon: (match && match.icon) || 'circle',
      name: n.tags.get('name'),
      geometry: n.geometry
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
