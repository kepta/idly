import { EntityId } from 'structs';
import { EntityType } from 'structs/geometry';
import { Properties } from 'structs/properties';
import { Tags } from 'structs/tags';
export interface Way {
    readonly id: EntityId;
    readonly type: EntityType.WAY;
    readonly tags: Tags;
    readonly properties: Properties;
    readonly nodes: EntityId[];
}
export declare function wayFactory({id, tags, properties, nodes}: {
    id: EntityId;
    tags?: Tags;
    properties?: Properties;
    nodes?: EntityId[];
}): Way;
