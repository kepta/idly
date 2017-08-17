import { Node } from 'structs/node';
import { Relation } from 'structs/relation';
import { Way } from 'structs/way';

export type Entities = Set<Node | Way | Relation>;
// export type EntitiesId = Set<string>;
export type EntityId = string;
export type Entity = Node | Way | Relation;
