// interface EntityType {
//   id: string;
// }
import * as _ from 'lodash';
import {
  osmIsInterestingTag,
  geoExtent,
  geoCross,
  osmOneWayTags,
  geoPolygonContainsPolygon,
  geoPolygonIntersectsPolygon
} from './helper';
import { dataDeprecated } from './deprecated';

type EntityType = 'changeset' | 'node' | 'way' | 'relation';
type EntityId = string;

export class Entity {
  constructor(sources: any[], type?: EntityType) {
    for (var i = 0; i < sources.length; ++i) {
      var source = sources[i];
      for (var prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
          if (source[prop] === undefined) {
            delete this[prop];
          } else {
            this[prop] = source[prop];
          }
        }
      }
    }
    this.type = type;
    if (!this.id && this.type) {
      this.id = Entity.genId(this.type);
    }
    if (!this.hasOwnProperty('visible')) {
      this.visible = true;
    }

    // if (debug) {
    //   Object.freeze(this);
    //   Object.freeze(this.tags);

    //   if (this.loc) Object.freeze(this.loc);
    //   if (this.nodes) Object.freeze(this.nodes);
    //   if (this.members) Object.freeze(this.members);
    // }
  }
  static fromOSM(type: EntityType, rand: number) {
    return type[0] + rand;
  }
  static toOSM(id: EntityId) {
    return parseInt(id.slice(1));
  }
  static genId(type: EntityType) {
    return Entity.fromOSM(type, Entity.next[type]--);
  }
  static next = {
    changeset: -1,
    node: -1,
    way: -1,
    relation: -1
  };
  static type(id: EntityId) {
    return { c: 'changeset', n: 'node', w: 'way', r: 'relation' }[id[0]];
  }
  static key(entity: Entity) {
    return entity.id + 'v' + (entity.v || 0);
  }
  id;
  v;
  tags: {};
  type: EntityType;
  visible: boolean;
  //   initialize(sources) {}
  extent(arg1) {}
  copy(resolver, copies) {
    if (copies[this.id]) return copies[this.id];

    var copy = Object.assign(
      new Entity([]),
      this,
      new Entity([
        {
          id: undefined,
          user: undefined,
          version: undefined
        }
      ])
    );
    copies[this.id] = copy;

    return copy;
  }

  osmId() {
    return Entity.toOSM(this.id);
  }

  isNew() {
    return this.osmId() < 0;
  }

  update(attrs) {
    return Object.assign(
      new Entity([]),
      this,
      new Entity([attrs, { v: 1 + (this.v || 0) }])
    );
  }

  mergeTags(tags) {
    var merged = _.clone(this.tags),
      changed = false;
    for (var k in tags) {
      var t1 = merged[k],
        t2 = tags[k];
      if (!t1) {
        changed = true;
        merged[k] = t2;
      } else if (t1 !== t2) {
        changed = true;
        merged[k] = _.union(t1.split(/;\s*/), t2.split(/;\s*/)).join(';');
      }
    }
    return changed ? this.update({ tags: merged }) : this;
  }

  // @tofix
  //   intersects(extent, resolver) {
  //     this.extent(resolver).intersects(extent);
  //   }

  isUsed(resolver) {
    return (
      _.without(Object.keys(this.tags), 'area').length > 0 ||
      resolver.parentRelations(this).length > 0
    );
  }

  hasInterestingTags() {
    return _.keys(this.tags).some(osmIsInterestingTag);
  }

  isHighwayIntersection() {
    return false;
  }

  isDegenerate() {
    return true;
  }

  deprecatedTags() {
    var tags = _.toPairs(this.tags);
    var deprecated = {};

    dataDeprecated.forEach(function(d) {
      var match = _.toPairs(d.old)[0];
      tags.forEach(function(t) {
        if (t[0] === match[0] && (t[1] === match[1] || match[1] === '*')) {
          deprecated[t[0]] = t[1];
        }
      });
    });

    return deprecated;
  }
}
