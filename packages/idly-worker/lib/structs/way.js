import { EntityType } from 'structs/geometry';
import { propertiesGen } from 'structs/properties';
export function wayFactory({ id, tags = new Map(), properties = propertiesGen({}), nodes = [] }) {
    return {
        id,
        type: EntityType.WAY,
        tags,
        properties,
        nodes
    };
}
//# sourceMappingURL=way.js.map