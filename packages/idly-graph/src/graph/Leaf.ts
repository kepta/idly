import { Iterable, Set as ImSet } from 'immutable';

import { weakCache } from 'idly-common/lib/misc/weakCache';
import { EntityType } from 'idly-common/lib/osm/structures';
import { Entity } from '../../../idly-common/lib/osm/structures';

const mWeakCache = new WeakMap();

export class Leaf {
  public static create(entity: Entity, ancestor?: Leaf): Leaf {
    if (mWeakCache.has(entity)) {
      return mWeakCache.get(entity);
    }
    const toRet = Leaf._create(entity, ancestor);
    if (mWeakCache) {
      // tslint:disable-next-line:no-expression-statement
      mWeakCache.set(entity, toRet);
    }
    return toRet;
  }

  private static _create(entity: Entity, ancestor: Leaf | undefined): Leaf {
    return new Leaf(entity, ancestor);
  }

  private readonly _entity: Entity;

  private readonly _ancestor: Leaf | undefined;

  constructor(
    entity: Entity,
    ancestor: Leaf | undefined,
    cache?: WeakMap<any, any>,
  ) {
    /* tslint:disable */
    this._ancestor = ancestor;
    this._entity = entity;
    /* tslint:enable */
  }

  public getAncestor(): Leaf | undefined {
    return this._ancestor;
  }

  public getEntity(): Entity {
    return this._entity;
  }

  public map(cb: (e: Entity) => Entity): Leaf {
    const newEntity = cb(this._entity);
    if (newEntity.id !== this._entity.id) {
      throw new Error('cannot modify entity id');
    }
    return Leaf.create(newEntity, this);
  }

  /** derived methods */

  public getAllAncestors(): ImSet<Leaf> {
    return getAllAncestors(this);
  }

  public getFamily(): ImSet<Leaf> {
    return getFamily(this);
  }

  public getDependencies(): string[] {
    return getDependencies(this);
  }

  public getFirstAncestor(): Leaf | undefined {
    return getFirstAncestor(this);
  }

  public isFirstGeneration(): boolean {
    return isFirstGeneration(this);
  }
}

/**
 * only returns ancestors i.e. excluding self
 * @param leaf
 */
export let getAllAncestors = (leaf: Leaf): ImSet<Leaf> => {
  const ancestor = leaf.getAncestor();
  if (!ancestor) {
    return ImSet([]);
  }
  return getFamily(ancestor);
};

/**
 * returns self + ancestors
 */
export let getFamily = weakCache((leaf: Leaf): ImSet<Leaf> => {
  const toReturn = ImSet([leaf]);
  const ancestor = leaf.getAncestor();
  if (!ancestor) {
    return toReturn;
  }
  return toReturn.union(getFamily(ancestor));
});

export let getDependencies = (leaf: Leaf): string[] => {
  const dep = new Set();
  const entity = leaf.getEntity();
  switch (entity.type) {
    /* tslint:disable */
    case EntityType.NODE: {
      dep.add(entity.id);
      break;
    }
    case EntityType.WAY: {
      entity.nodes.forEach(n => dep.add(n));
      break;
    }
    case EntityType.RELATION: {
      entity.members.forEach(m => {
        if (m.id) {
          dep.add(m.id);
        }
      });
      break;
    }
    /* tslint:enable */
  }
  return [...dep];
};

export let getFirstAncestor = (leaf: Leaf): Leaf | undefined =>
  getAllAncestors(leaf).last();

export let isFirstGeneration = (leaf: Leaf): boolean =>
  leaf.getAncestor() ? false : true;
