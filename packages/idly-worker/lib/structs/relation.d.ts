import { EntityId } from 'structs';
import { EntityType } from 'structs/geometry';
import { Member } from 'structs/members';
import { Properties } from 'structs/properties';
import { Tags } from 'structs/tags';
export interface Relation {
    readonly id: EntityId;
    readonly type: EntityType.RELATION;
    readonly tags: Tags;
    readonly properties: Properties;
    readonly members: Member[];
}
export declare function relationFactory({id, tags, properties, members}: {
    id: EntityId;
    tags?: Tags;
    properties?: Properties;
    members?: Member[];
}): Relation;
