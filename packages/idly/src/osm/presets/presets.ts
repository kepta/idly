import { Map } from 'immutable';
import * as _ from 'lodash';

import { data } from 'data/index';

import { presetCategory } from 'osm/presets/category';
import { presetCollection } from 'osm/presets/collection';
import { presetField } from 'osm/presets/field';
import { presetPreset } from 'osm/presets/preset';

import {
  Geometries,
  getGeometry,
  isOnAddressLine
} from 'osm/entities/helpers/misc';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

type Entity = Node | Way | Relation;
export const t = (...args) => args.join(',');

const all = presetCollection([]);
const recent = presetCollection([]);

let fields = {};
let universal = [];

class Index {
  private point: {};
  private vertex: {};
  private line: {};
  private area: {};
  private relation: {};
  constructor(o: any = {}) {
    this.point = o;
    this.vertex = o;
    this.line = o;
    this.area = o;
    this.relation = o;
  }
  set(g: Geometries, value: any) {
    if (g === Geometries.POINT) {
      this.point = value;
    } else if (g === Geometries.VERTEX) {
      this.vertex = value;
    } else if (g === Geometries.LINE) {
      this.line = value;
    } else if (g === Geometries.AREA) {
      this.area = value;
    } else if (g === Geometries.RELATION) {
      this.relation = value;
    } else {
      throw new Error('type not found');
    }
  }
  get(g: Geometries) {
    if (g === Geometries.POINT) {
      return this.point;
    } else if (g === Geometries.VERTEX) {
      return this.vertex;
    } else if (g === Geometries.LINE) {
      return this.line;
    } else if (g === Geometries.AREA) {
      return this.area;
    } else if (g === Geometries.RELATION) {
      return this.relation;
    } else {
      throw new Error('type not found');
    }
  }
}

let index = new Index();
const defaults = new Index(all);

/**
 * @REVISIT fix areakeys init for
 */

export function initPresets(d: any = data.presets) {
  all.collection = [];
  recent.collection = [];
  fields = {};
  universal = [];
  index = new Index();

  if (d.fields) {
    _.forEach(d.fields, function(dd, id) {
      fields[id] = presetField(id, dd);
      if (dd.universal) universal.push(fields[id]);
    });
  }

  if (d.presets) {
    _.forEach(d.presets, function(dd, id) {
      all.collection.push(presetPreset(id, dd, fields));
    });
  }

  if (d.categories) {
    _.forEach(d.categories, function(dd, id) {
      all.collection.push(presetCategory(id, dd, all));
    });
  }

  if (d.defaults) {
    const getItem = _.bind(all.item, all);
    defaults.set(
      Geometries.AREA,
      presetCollection(d.defaults.area.map(getItem))
    );
    defaults.set(
      Geometries.LINE,
      presetCollection(d.defaults.line.map(getItem))
    );
    defaults.set(
      Geometries.POINT,
      presetCollection(d.defaults.point.map(getItem))
    );
    defaults.set(
      Geometries.VERTEX,
      presetCollection(d.defaults.vertex.map(getItem))
    );
    defaults.set(
      Geometries.RELATION,
      presetCollection(d.defaults.relation.map(getItem))
    );
  }

  for (const preset of all.collection) {
    const geometry = preset.geometry;
    if (!Array.isArray(geometry)) continue;
    for (const ge of geometry) {
      const g = index.get(ge);
      /**
       * @REVISIT convert preset.tags to Map
       */
      for (const k in preset.tags) {
        if (k) {
          g[k] = g[k] || [];
          g[k].push(preset);
        }
      }
    }
  }

  return all;
}

export function presetsMatch(entity: Entity, areaKeys: AreaKeys = Map()) {
  let geometry = entity.properties.geometry; // getGeometry(entity, areaKeys);
  if (!geometry) throw new Error('no geometry found' + entity.id);
  // Treat entities on addr:interpolation lines as points, not vertices (#3241)
  if (geometry === Geometries.VERTEX && isOnAddressLine(entity)) {
    geometry = Geometries.POINT;
  }

  const geometryMatches = index.get(geometry);
  let best = -1;
  let match;
  entity.tags.forEach((v, k) => {
    const keyMatches = geometryMatches[k];
    if (!keyMatches) return;

    for (let i = 0; i < keyMatches.length; i++) {
      const score = keyMatches[i].matchScore(entity);
      if (score > best) {
        best = score;
        match = keyMatches[i];
      }
    }
  });

  return match || all.item(geometry);
}

export type AreaKeys = Map<string, Map<string, boolean>>;
export function initAreaKeys(allCollection): AreaKeys {
  let localAreaKeys: AreaKeys = Map();
  const ignore = ['barrier', 'highway', 'footway', 'railway', 'type']; // probably a line..
  // all . collection neeeds to init
  const presets = _.reject(allCollection, 'suggestion');

  // whitelist
  /**
   * @TOFIX: type presets bro
   */
  presets.forEach(function(d: any) {
    let key;
    for (key in d.tags) break;
    if (!key) return;
    if (ignore.indexOf(key) !== -1) return;

    if (d.geometry.indexOf('area') !== -1) {
      // probably an area..
      localAreaKeys = localAreaKeys.set(key, localAreaKeys.get(key) || Map());
    }
  });

  // blacklist
  presets.forEach(function(d: any) {
    let key;
    for (key in d.tags) break;
    if (!key) return;
    if (ignore.indexOf(key) !== -1) return;

    const value = d.tags[key];
    if (
      localAreaKeys.has(key) && // probably an area...
      d.geometry.indexOf('line') !== -1 && // but sometimes a line
      value !== '*'
    ) {
      // areaKeys.get(key)[value] = true;
      localAreaKeys = localAreaKeys.setIn([key, value], true);
    }
  });

  return localAreaKeys;
}
