import { EntityType } from 'structs/geometry';
import { genLngLat } from 'structs/lngLat';
import { propertiesGen } from 'structs/properties';
export function nodeFactory({ id, tags = new Map(), loc = genLngLat([0, 0]), properties = propertiesGen({}) }) {
    return {
        id,
        tags,
        type: EntityType.NODE,
        loc,
        properties
    };
}
//# sourceMappingURL=node.js.map