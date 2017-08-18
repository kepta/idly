import { getNodeGeometry } from 'helpers/getNodeGeometry';
import { presetsMatcherCached } from 'presets/presets';
export const DEFAULT_NODE_ICON = 'circle';
export function nodeCombiner(node, parentWays) {
    return Object.assign({}, nodeToPoint(node), { properties: Object.assign({}, applyNodeMarkup(
        // presetsMatcher,
        getNodeGeometry(node.id, parentWays), node.tags), { id: node.id }) });
}
export const nodeToPoint = (node) => {
    return {
        id: node.id,
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [node.loc.lon, node.loc.lat]
        },
        properties: {}
    };
};
export const applyNodeMarkup = (geometry, tags) => {
    const match = presetsMatcherCached(geometry)(tags);
    return {
        icon: (match && match.icon) || DEFAULT_NODE_ICON,
        name: tags.get('name'),
        geometry
    };
};
//# sourceMappingURL=nodeToFeature.js.map