import { EntityId } from 'structs';
import { EntityType } from 'structs/geometry';
import { LngLat } from 'structs/lngLat';
import { Properties } from 'structs/properties';
import { Tags } from 'structs/tags';
export interface Node {
    readonly id: EntityId;
    readonly tags: Tags;
    readonly type: EntityType.NODE;
    readonly loc: LngLat;
    readonly properties: Properties;
}
export declare function nodeFactory({id, tags, loc, properties}: {
    id: EntityId;
    tags?: Tags;
    loc?: LngLat;
    properties?: Properties;
}): Node;
