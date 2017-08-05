import { LineString, Polygon } from 'geojson';
import * as turf from 'turf';

import { Feature } from 'typings/geojson';

import { getGeometry } from 'osm/entities/helpers/misc';
import { Node } from 'osm/entities/node';
import { initAreaKeys, initPresets, presetsMatch } from 'osm/presets/presets';

import { Geometries } from 'osm/entities/constants';
import { Way } from 'osm/entities/way';
import { Graph } from 'osm/history/graph';
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
const { collection } = initPresets();
const areaKeys = initAreaKeys(collection);
/**
 *
 * @REVISIT this func also needs to handle modifiedGraph
 *  for now i removed it so i can test caching and anyway
 *  not yet implemented modified ways
 */
function _wayToFeat(w: Way, graph: Graph): WayFeature {
  if (w instanceof Way) {
    const match = presetsMatch(w, areaKeys);
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
    if (w.geometry === Geometries.LINE) {
      feat = turf.lineString(
        nodes.map(n => [n.loc.lon, n.loc.lat]).toArray(),
        properties
      ) as Feature<LineString, INodeProperties>;
      feat.id = w.id;
    } else if (w.geometry === Geometries.AREA) {
      const geos = nodes.map(n => [n.loc.lon, n.loc.lat]).toArray();
      geos.push(geos[0]);
      feat = turf.polygon([geos], properties) as Feature<
        Polygon,
        INodeProperties
      >;
    }
    feat.id = w.id;
    return feat;
  }
}

export const wayToFeat = weakCache2(_wayToFeat);
