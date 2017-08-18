import { Entity, EntityId } from 'structs';
export declare type Table = Map<EntityId, Entity>;
export declare function addEntitiesTable(t: Table, entities: Entity[]): Map<string, Entity>;
