import { wayFactory } from 'idly-common/lib/osm/wayFactory';
import { Iterable, Set as ImSet } from 'immutable';

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
import { recursiveLookup } from '../misc/recursiveLookup';
import { Leaf } from './Leaf';

import { calculateParentWays } from '../misc/calculateParentWays';

export class Tree {
  public static create(leaf: Leaf): Tree {
    return new Tree(undefined, ImSet([leaf]));
  }
  private readonly parent: Tree | undefined;
  private readonly branch: ImSet<Leaf>;
  constructor(parent: Tree | undefined, branch: ImSet<Leaf>) {
    /* tslint:disable */
    this.parent = parent;
    this.branch = branch;
    /* tslint:enable */
  }

  public getParent(): Tree | undefined {
    return this.parent;
  }
  public getBranch(): ImSet<Leaf> {
    return this.branch;
  }

  // for debugging
  public getDepth(count = 1): number {
    return this.parent ? this.parent.getDepth(count + 1) : count;
  }

  // for debugging
  public print(arr = []): string {
    const toPrint = arr.concat([
      this.branch.toArray().map(leaf => leaf.getEntity()),
    ]);
    if (!this.parent) {
      return JSON.stringify(toPrint, null, 2);
    }
    return this.parent.print(toPrint);
  }

  public newBranch(branch: ImSet<Leaf>): Tree {
    return new Tree(this, branch);
  }

  public getOldLeaves(): ImSet<Leaf> {
    if (!this.parent) {
      return ImSet();
    }
    return this.parent.getAllLeaves().subtract(this.branch);
  }

  public getAllLeaves(): ImSet<Leaf> {
    if (!this.parent) {
      return this.branch;
    }
    return this.branch.union(this.parent.getAllLeaves());
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
