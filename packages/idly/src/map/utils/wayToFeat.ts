import { LineString, Polygon } from 'geojson';
import * as turf from 'turf';

import { Feature } from 'typings/geojson';

import { presetsMatcher } from 'osm/presets/presets';
import * as R from 'ramda';

import { Geometry } from 'osm/entities/constants';
import { Way } from 'osm/entities/way';
import { Graph } from 'osm/history/graph';
import { tagClassesPrimary } from 'osm/styling/tagClasses';
import { weakCache, weakCache2 } from 'utils/weakCache';

interface IWayProperties {
  way_properties: string;
  tags: string;
  id: string;
  name?: string;
  geometry: Geometry.LINE | Geometry.AREA;
  nodes: string;
  tagsClass: string;
  tagsClassType: string;
}
/**
 * @TOFIX use areaKeys from the core.
 */
export type WayFeature = Feature<LineString | Polygon, IWayProperties>;

const tagClassesPrimaryCache = weakCache(tagClassesPrimary);

const matchLine = weakCache(R.curry(presetsMatcher)(Geometry.LINE));

const matchArea = weakCache(R.curry(presetsMatcher)(Geometry.AREA));

/**
 *
 * @REVISIT this func also needs to handle modifiedGraph
 *  for now i removed it so i can test caching and anyway
 *  not yet implemented modified ways
 */
function _wayToFeat(w: Way, graph: Graph): WayFeature {
  if (w instanceof Way) {
    const match =
      w.geometry === Geometry.LINE ? matchLine(w.tags) : matchArea(w.tags);

    const [tagsClass, tagsClassType] = tagClassesPrimaryCache(w.tags);
    const properties: IWayProperties = {
      way_properties: JSON.stringify(w.properties),
      nodes: JSON.stringify(w.nodes),
      tags: JSON.stringify(w.tags),
      id: w.id,
      name: w.tags.get('name'),
      geometry: w.geometry,
      tagsClass,
      tagsClassType
    };
    const nodes = w.nodes.map(id => {
      /**
       * @TOFIX this returns undefined sometimes
       * eg n589100232, way w170294692 not found at
       * #17.99/40.73491/-73.97542
       */
      const node = graph.node.get(id);
      if (!node) throw new Error(`$node not found ${id}, way ${w.id}`);
      return node; // || graphMod.node.get(id);
    });
    let feat;
    if (w.geometry === Geometry.LINE) {
      // if (!n.loc) throw new Error('doesnt have loc');
      feat = turf.lineString(
        nodes.map(n => [n.loc.lon, n.loc.lat]).toArray(),
        properties
      ) as Feature<LineString, IWayProperties>;
      feat.id = w.id;
    } else if (w.geometry === Geometry.AREA) {
      // if (nodes[0])
      if (!nodes.first().equals(nodes.last()))
        throw new Error('area first last not same');
      const geoCoordinates = nodes.map(n => [n.loc.lon, n.loc.lat]).toArray();
      // if (R.equals())
      // geoCoordinates.push(geoCoordinates[0]);
      feat = turf.polygon([geoCoordinates], properties) as Feature<
        Polygon,
        IWayProperties
      >;
    }
    feat.id = w.id;
    return feat;
  }
}

export const wayToFeat = weakCache2(_wayToFeat);
