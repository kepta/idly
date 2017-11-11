import { EntityType } from 'idly-common/lib/osm/structures';
import { Entity } from '../../../idly-common/lib/osm/structures';

const moduleCache = new WeakMap();

export class Leaf {
  public static create(
    entity: Entity,
    ancestor?: Leaf,
    cache: WeakMap<any, any> = moduleCache,
  ): Leaf {
    if (cache.has(entity)) {
      return cache.get(entity);
    }
    const toRet = Leaf._create(ancestor, entity);
    if (cache) {
      // tslint:disable-next-line:no-expression-statement
      cache.set(entity, toRet);
    }
    return toRet;
  }

  private static _create(ancestor: Leaf | undefined, entity: Entity): Leaf {
    return new Leaf(entity, ancestor);
  }
  public readonly entity: Entity;
  private readonly _ancestor: Leaf | undefined;

  constructor(
    entity: Entity,
    ancestor: Leaf | undefined,
    cache?: WeakMap<any, any>,
  ) {
    /* tslint:disable */
    this._ancestor = ancestor;
    this.entity = entity;
    /* tslint:enable */
  }

  public map(
    cb: (e: Entity) => Entity,
    cache: WeakMap<any, any> = moduleCache,
  ): Leaf {
    const newEntity = cb(this.entity);
    return Leaf.create(newEntity, this, cache);
  }
  public isFirstGeneration(): boolean {
    return this._ancestor ? false : true;
  }
  public getAncestor(): Leaf | undefined {
    return this._ancestor;
  }
  public getFirstAncestor(): Leaf | undefined {
    if (!this._ancestor) {
      return this;
    }
    return this._ancestor.getFirstAncestor();
  }
  public getDependencies(): Set<string> {
    const dep = new Set();
    switch (this.entity.type) {
      /* tslint:disable */
      case EntityType.NODE: {
        dep.add(this.entity.id);
        break;
      }
      case EntityType.WAY: {
        this.entity.nodes.forEach(n => dep.add(n));
        break;
      }
      case EntityType.RELATION: {
        this.entity.members.forEach(m => {
          if (m.id) {
            dep.add(m.id);
          }
        });
        break;
      }
      /* tslint:enable */
    }
    return dep;
  }
}
