import { Map as ImMap, Set as ImSet } from 'immutable';
import { Entity, EntityId, NodeId, WayId } from './structures';

export type ParentWays = ImMap<NodeId, ImSet<WayId> | undefined>;

// Table used to map id -> entity
export type EntityTable = ImMap<EntityId, Entity | undefined>;
