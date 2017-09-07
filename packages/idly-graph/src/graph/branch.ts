import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { removeFromEntityTable } from 'idly-common/lib/osm/removeFromEntityTable';
import {
  Entity,
  EntityId,
  EntityTable,
  EntityType,
  NodeId,
  ParentWays,
  Way,
  WayId,
} from 'idly-common/lib/osm/structures';
import { calculateParentWays } from '../misc/calculateParentWays';

export class Branch {
  public static fromString(json: string): Branch {
    const { knownIds, entityTable, parentWays }: any = JSON.parse(json);
    if (!knownIds || !entityTable || !parentWays) {
      throw new Error('wrong string');
    }
    return new Branch(ImSet(knownIds), ImMap(entityTable), ImMap(parentWays));
  }

  public readonly id: EntityId;
  public readonly type: EntityType;
  public readonly entity: Entity;
  public readonly parentWay: ImSet<WayId>;

  //   private _parentRelations: any;

  constructor(entity: Entity, parentWay: ImSet<WayId> | undefined) {
    /* tslint:disable */
    this.id = entity.id;
    this.type = entity.type;
    this.entity = entity;
    this._parentWay = parentWay || ImSet();
    /* tslint:enable */
  }

  public toJSON(): string {
    return JSON.stringify({
      id: this.id,
      type: this.type,
      parentWay: this._parentWay,
    });
  }
}
