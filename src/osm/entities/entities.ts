import { Set } from 'immutable';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

export type Entities = Set<Node | Way | Relation>;
export type Entity = Node | Way | Relation;
