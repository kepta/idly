import { Entity, EntityId } from 'structs';
import { Way } from 'structs/way';
export declare type ParentWays = Map<EntityId, Set<EntityId>>;
/**
 * @param parentWays mutates in place
 * @param ways
 */
export declare function calculateParentWays(parentWays: ParentWays, ways: Way[]): Map<string, Set<string>>;
export declare function parseXML(xml: Document, parentWays?: ParentWays): {
    entities: Entity[];
    parentWays: ParentWays;
};
