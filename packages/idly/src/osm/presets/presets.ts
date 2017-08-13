import * as _ from 'lodash';

import { data } from 'data/index';

import { presetCategory } from 'osm/presets/category';
import { presetCollection } from 'osm/presets/collection';
import { presetField } from 'osm/presets/field';
import { presetPreset } from 'osm/presets/preset';

import { Geometry } from 'osm/entities/constants';
import { Tags } from 'osm/entities/helpers/tags';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';
import { initAreaKeys } from 'osm/presets/areaKeys';
import { presetsMatch } from 'osm/presets/match';

type Entity = Node | Way | Relation;

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
  set(g: Geometry, value: any) {
    if (g === Geometry.POINT) {
      this.point = value;
    } else if (g === Geometry.VERTEX) {
      this.vertex = value;
    } else if (g === Geometry.LINE) {
      this.line = value;
    } else if (g === Geometry.AREA) {
      this.area = value;
    } else if (g === Geometry.RELATION) {
      this.relation = value;
    } else {
      throw new Error('type not found');
    }
  }
  get(g: Geometry) {
    if (g === Geometry.POINT) {
      return this.point;
    } else if (g === Geometry.VERTEX) {
      return this.vertex;
    } else if (g === Geometry.LINE) {
      return this.line;
    } else if (g === Geometry.AREA) {
      return this.area;
    } else if (g === Geometry.RELATION) {
      return this.relation;
    } else {
      throw new Error('type not found');
    }
  }
}

export function initPresets(d: any = data.presets) {
  const all = presetCollection([]);
  const recent = presetCollection([]);

  all.collection = [];
  recent.collection = [];

  const fields = {};
  const universal = [];
  const index = new Index();
  const defaults = new Index(all);

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
    defaults.set(Geometry.AREA, presetCollection(d.defaults.area.map(getItem)));
    defaults.set(Geometry.LINE, presetCollection(d.defaults.line.map(getItem)));
    defaults.set(
      Geometry.POINT,
      presetCollection(d.defaults.point.map(getItem))
    );
    defaults.set(
      Geometry.VERTEX,
      presetCollection(d.defaults.vertex.map(getItem))
    );
    defaults.set(
      Geometry.RELATION,
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

  return { all, recent, index, defaults };
}

export const presets: { all; defaults; index; recent } = initPresets();

export const areaKeys = initAreaKeys(presets.all);

export const presetsMatcher = (geometry: Geometry, tags: Tags) =>
  presetsMatch(presets.all, presets.index, areaKeys, geometry, tags);
