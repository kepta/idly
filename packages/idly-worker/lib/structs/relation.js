import { EntityType } from 'structs/geometry';
import { propertiesGen } from 'structs/properties';
export function relationFactory({ id, tags = new Map(), properties = propertiesGen({}), members = [] }) {
    return {
        id,
        type: EntityType.RELATION,
        tags,
        properties,
        members
    };
}
//# sourceMappingURL=relation.js.map