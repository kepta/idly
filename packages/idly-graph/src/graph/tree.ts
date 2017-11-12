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
  public static create(leaf: Leaf): Tree {
    return new Tree(undefined, ImSet([leaf]));
  }
  private readonly _parent: Tree | undefined;
  private readonly _branch: ImSet<Leaf>;
  constructor(parent: Tree | undefined, branch: ImSet<Leaf>) {
    /* tslint:disable */
    this._parent = parent;
    this._branch = branch;
    /* tslint:enable */
  }

  public getParent(): Tree | undefined {
    return this._parent;
  }

  public getBranch(): ImSet<Leaf> {
    return this._branch;
  }

  // for debugging
  public getDepth(count = 1): number {
    return this._parent ? this._parent.getDepth(count + 1) : count;
  }

  // for debugging
  public print(arr = []): string {
    const toPrint = arr.concat([
      this._branch.toArray().map(leaf => leaf.getEntity()),
    ]);
    if (!this._parent) {
      return JSON.stringify(toPrint, null, 2);
    }
    return this._parent.print(toPrint);
  }

  public newBranch(branch: ImSet<Leaf>): Tree {
    return new Tree(this, branch);
  }

  public getOldLeaves(): ImSet<Leaf> {
    if (!this._parent) {
      return ImSet();
    }
    return this._parent.getAllLeaves().subtract(this._branch);
  }

  public getAllLeaves(): ImSet<Leaf> {
    if (!this._parent) {
      return this._branch;
    }
    return this._branch.union(this._parent.getAllLeaves());
  }

  public getAllVirginIds(): string[] {
    const allEntities = this.getAllLeaves().toArray();
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
}
