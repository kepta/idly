import { wayFactory } from 'idly-common/lib/osm/wayFactory';
import { Iterable, Set as ImSet } from 'immutable';
import { recursiveLookup } from '../misc/recursiveLookup';
import { Leaf } from './Leaf';

import { entityFactoryCache } from 'idly-common/lib/osm/entityFactory';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { removeFromEntityTable } from 'idly-common/lib/osm/removeFromEntityTable';
import {
  Entity,
  EntityId,
  EntityTable,
  EntityType,
  Node,
  NodeId,
  ParentWays,
  Relation,
  Way,
  WayId,
} from 'idly-common/lib/osm/structures';

import { calculateParentWays } from '../misc/calculateParentWays';

export class Tree {
  private readonly _parent: Tree | undefined;
  private readonly _leaves: ImSet<Leaf>;
  constructor(parent: Tree | undefined, leaves: ImSet<Leaf>) {
    /* tslint:disable */
    this._parent = parent;
    this._leaves = leaves;
    /* tslint:enable */
  }

  public newLeaves(leaves: ImSet<Leaf>): Tree {
    return new Tree(this, leaves);
  }
  public getAllVirginIds(): string[] {
    const allEntities = this.unionLeaves().toArray();
    return Array.from(
      allEntities
        .filter((en: Leaf | undefined) => {
          if (en) {
            return en.isFirstGeneration();
          }
          return false;
        })
        .reduce((prev: Set<string>, e: Leaf | undefined) => {
          if (e) {
            /* tslint:disable */
            for (const elem of e.getDependencies()) {
              prev.add(elem);
            }
            /* tslint:enable */
          }
          return prev;
        }, new Set()),
    );
  }
  public getHidden(): ImSet<Leaf> {
    const hidden = ImSet();
    if (!this._parent) {
      return ImSet();
    }
    return this._parent.unionLeaves().subtract(this._leaves);
  }
  public getLeaves(): ImSet<Leaf> {
    return this._leaves;
  }
  public unionLeaves(): ImSet<Leaf> {
    if (!this._parent) {
      return ImSet();
    }
    return this._leaves.union(this._parent.unionLeaves());
  }
}
