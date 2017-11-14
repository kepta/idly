import { weakCache } from 'idly-common/lib/misc/weakCache';

import {
  EntityType,
  Node,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { Entity } from 'idly-common/lib/osm/structures';

import {
  createEntity,
  NodeLike,
  RelLike,
  WayLike,
} from '../actions/entity/createEntity';

let LeafCache = new WeakMap<Entity, Leaf>();

const mStrongCache = new Map();

export type EntityKeys = keyof (Node & Way & Relation);

export class Leaf {
  public static create(entity: Entity, ancestor?: Leaf): Leaf {
    const inCache = LeafCache.get(entity);

    if (inCache) {
      return inCache;
    }

    const toRet = new Leaf(entity, ancestor);
    if (LeafCache) {
      // tslint:disable-next-line:no-expression-statement
      LeafCache.set(entity, toRet);
    }
    return toRet;
  }

  public static fromString(leafString: string): Leaf | undefined {
    const entities: Entity[] = JSON.parse(leafString)
      .map(createEntity)
      .reverse();

    let prevLeaf;
    for (const entity of entities) {
      // tslint:disable-next-line:no-expression-statement
      prevLeaf = Leaf.create(entity, prevLeaf);
    }
    return prevLeaf;
  }

  private static _create(entity: Entity, ancestor: Leaf | undefined): Leaf {
    return new Leaf(entity, ancestor);
  }

  private readonly entity: Entity;

  private readonly ancestor: Leaf | undefined;

  constructor(
    entity: Entity,
    ancestor: Leaf | undefined,
    cache?: WeakMap<any, any>,
  ) {
    /* tslint:disable */
    this.ancestor = ancestor;
    this.entity = entity;
    /* tslint:enable */
  }

  public getAncestor(): Leaf | undefined {
    return this.ancestor;
  }

  public getEntity(): Entity {
    return this.entity;
  }
  /**
   * accepts an EntityLike
   */
  public map(cb: (e: Entity) => any): Leaf {
    const partEntity = cb(this.entity);

    if (partEntity.id && partEntity.id !== this.entity.id) {
      throw new Error('cannot modify entity id');
    }

    const newEntity = createEntity(partEntity);

    if (newEntity !== this.entity) {
      return Leaf.create(newEntity, this);
    }
    return this;
  }

  /** derived methods */
  public toString(): string {
    return leafToString(this);
  }

  public getAllAncestors(): Leaf[] {
    return getAllAncestors(this);
  }

  public getFamily(): Leaf[] {
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
export let getAllAncestors = weakCache((leaf: Leaf): Leaf[] => {
  const ancestor = leaf.getAncestor();
  if (!ancestor) {
    return [];
  }
  return getFamily(ancestor);
});

/**
 * returns self + ancestors
 */
export let getFamily = weakCache((leaf: Leaf): Leaf[] => {
  const toReturn = [leaf];
  const ancestor = leaf.getAncestor();
  if (!ancestor) {
    return toReturn;
  }
  return toReturn.concat(getFamily(ancestor));
});

export let getAllEntities = (leaf: Leaf): Entity[] =>
  getFamily(leaf).map(l => l.getEntity());

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

export let getFirstAncestor = (leaf: Leaf): Leaf | undefined => {
  const ancestors = getAllAncestors(leaf);
  return ancestors[ancestors.length - 1];
};

export let isFirstGeneration = (leaf: Leaf) =>
  leaf.getAncestor() ? false : true;

/**
 * @notes need to stringify entities twice, to use caching to have just one
 * instance of entity running.
 * @param leaf
 */
export let leafToString = (leaf: Leaf): string =>
  JSON.stringify(getAllEntities(leaf).map(r => JSON.stringify(r)));

/** cache */
export function cacheAccess(): {
  readonly LeafCache: WeakMap<any, any>;
} {
  return { LeafCache };
}

export function setCache(cache: {
  readonly mWeakCache: WeakMap<any, any>;
  readonly mStrongCache: Map<any, any>;
}): void {
  // tslint:disable-next-line:no-expression-statement
  LeafCache = cache.mWeakCache;
}
