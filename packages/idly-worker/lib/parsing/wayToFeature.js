// import { LineString, Polygon } from 'geojson';
// import * as turf from 'turf';
// import { List, Map } from 'immutable';
// import { Feature } from 'typings/geojson';
// import { isArea } from 'osm/entities/helpers/misc';
// import { Node } from 'osm/entities/node';
// import { presetsMatcherCached } from 'osm/presets/presets';
// import { Geometry } from 'osm/entities/constants';
// import { Way } from 'osm/entities/way';
// import { Graph } from 'osm/history/graph';
// import { tagClassesPrimary } from 'osm/styling/tagClasses';
// import { weakCache } from 'utils/weakCache';
import * as turfLineString from 'turf-linestring';
import * as turfPolygon from 'turf-polygon';
import { isArea } from 'helpers/isArea';
import { weakCache } from 'helpers/weakCache';
import { Geometry } from 'structs/geometry';
import { tagClassesPrimary } from 'osm/tagsStyling';
import { presetsMatcherCached } from 'presets/presets';
const tagClassesPrimaryCache = weakCache(tagClassesPrimary);
/**
 *
 * @REVISIT this func also needs to handle modifiedGraph
 *  for now i removed it so i can test caching and anyway
 *  not yet implemented modified ways
 */
export function wayCombiner(way, table) {
    const geometry = isArea(way) ? Geometry.AREA : Geometry.LINE;
    const [tagsClass, tagsClassType] = tagClassesPrimaryCache(way.tags);
    const match = presetsMatcherCached(geometry)(way.tags);
    // const nodes = getCoordsFromGraph(graph.node, way.nodes);
    const nodes = getCoordsFromTable(table, way.nodes);
    const properties = {
        id: way.id,
        name: way.tags.get('name') || way.tags.get('ref'),
        icon: match && match.icon,
        geometry,
        tagsClass,
        tagsClassType
    };
    return Object.assign({ id: way.id }, wayToLineString(geometry, nodes), { properties });
}
export function getCoordsFromTable(table, nodes) {
    return nodes.map(n => {
        if (!table.has(n))
            throw new Error('node not found ' + n);
        const node = table.get(n);
        return [node.loc.lon, node.loc.lat];
    });
}
/**
 * graphNode comes from graph.node
 *  planning to use it for memoization.
 *  every ms counts. hehehe.
 */
export function wayToLineString(geometry, nodeCoords) {
    let feat;
    if (geometry === Geometry.LINE) {
        feat = turfLineString(nodeCoords, {});
    }
    else if (geometry === Geometry.AREA) {
        feat = turfPolygon([nodeCoords], {});
    }
    else {
        throw new Error('not a matching geometry provided for way');
    }
    return feat;
}
//# sourceMappingURL=wayToFeature.js.map