import { LineString, Polygon } from 'geojson';
import * as turf from 'turf';

import { Feature } from 'typings/geojson';

import { getGeometry } from 'osm/entities/helpers/misc';
import { Node } from 'osm/entities/node';
import { initPresets } from 'osm/presets/presets';
import * as R from 'ramda';

import { Geometry } from 'osm/entities/constants';
import { Way } from 'osm/entities/way';
import { Graph } from 'osm/history/graph';
import { initAreaKeys } from 'osm/presets/areaKeys';
import { presetsMatch } from 'osm/presets/match';
import { weakCache, weakCache2 } from 'utils/weakCache';

interface INodeProperties {
  node_properties: string;
  tags: string;
  id: string;
  name?: string;
  geometry: string;
}
/**
 * @TOFIX this whole Nodeproperties fuck up
 *  the typings dont support properties
 */
export type WayFeature = Feature<LineString | Polygon, INodeProperties>;
const { all, defaults, index, recent } = initPresets();
const areaKeys = initAreaKeys(all);
const curriedPresetsMatch = R.curry(presetsMatch)(all, index, areaKeys);

/**
 *
 * @REVISIT this func also needs to handle modifiedGraph
 *  for now i removed it so i can test caching and anyway
 *  not yet implemented modified ways
 */
function _wayToFeat(w: Way, graph: Graph): WayFeature {
  if (w instanceof Way) {
    const match = curriedPresetsMatch(w.tags, w.geometry);
    const properties: INodeProperties = {
      node_properties: JSON.stringify(w.properties),
      tags: JSON.stringify(w.tags),
      id: w.id,
      geometry: w.geometry
    };
    const nodes = w.nodes.map(id => {
      return graph.node.get(id); // || graphMod.node.get(id);
    });
    let feat;
    if (w.geometry === Geometry.LINE) {
      feat = turf.lineString(
        nodes.map(n => [n.loc.lon, n.loc.lat]).toArray(),
        properties
      ) as Feature<LineString, INodeProperties>;
      feat.id = w.id;
    } else if (w.geometry === Geometry.AREA) {
      const geoCoordinates = nodes.map(n => [n.loc.lon, n.loc.lat]).toArray();
      geoCoordinates.push(geoCoordinates[0]);
      feat = turf.polygon([geoCoordinates], properties) as Feature<
        Polygon,
        INodeProperties
      >;
    }
    feat.id = w.id;
    return feat;
  }
}

export const wayToFeat = weakCache2(_wayToFeat);
