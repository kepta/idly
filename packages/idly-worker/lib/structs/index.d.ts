import { Node } from 'structs/node';
import { Relation } from 'structs/relation';
import { Way } from 'structs/way';
export declare type Entities = Set<Node | Way | Relation>;
export declare type EntityId = string;
export declare type Entity = Node | Way | Relation;
