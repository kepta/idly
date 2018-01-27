import { entityTableGen } from '../../osm/entityTableGen';
import { EntityId, EntityTable } from '../../osm/structures';

import { createEntity } from '../actions/entity/createEntity';
import { Leaf } from './Leaf';

interface ShrubObj {
  entities: string[];
  knownIds: string[];
}

export class Shrub {
  public static create(knownIds: string[], entityTable: EntityTable) {
    return new Shrub(knownIds, entityTable);
  }

  public static fromString(str: string): Shrub {
    const { entities, knownIds }: ShrubObj = JSON.parse(str);
    const entityTable = entityTableGen(entities.map(createEntity));
    return new Shrub(knownIds, entityTable);
  }

  private readonly knownIds: string[];
  private readonly entityTable: EntityTable;

  constructor(knownIds: string[], entityTable: EntityTable) {
    this.knownIds = knownIds;
    this.entityTable = entityTable;
  }

  public getDependant(id: EntityId): Leaf | undefined {
    const entity = this.entityTable.get(id);
    return entity && Leaf.create(entity);
  }

  public getLeaf(id: EntityId): Leaf | undefined {
    if (this.knownIds.indexOf(id) === -1) {
      return undefined;
    }
    return this.getDependant(id);
  }

  public getLeaves(): Array<Leaf | undefined> {
    return this.knownIds.map(id => this.getDependant(id));
  }
  public toObject(): {
    entityTable: EntityTable;
    knownIds: string[];
  } {
    return {
      entityTable: this.entityTable,
      knownIds: this.knownIds,
    };
  }
  public toString(): string {
    const obj: ShrubObj = {
      entities: this.entityTable
        .valueSeq()
        .toArray()
        .map(e => JSON.stringify(e)),
      knownIds: this.knownIds,
    };
    return JSON.stringify(obj);
  }
}
