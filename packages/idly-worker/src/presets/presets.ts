import * as _ from 'lodash';

import { data } from 'data/index';

import { presetCategory } from 'presets/category';
import { presetCollection } from 'presets/collection';
import { presetField } from 'presets/field';
import { presetPreset } from 'presets/preset';

import { weakCache } from 'helpers/weakCache';
import { initAreaKeys } from 'presets/areaKeys';
import { presetsMatch } from 'presets/match';
import { Geometry } from 'structs/geometry';
import { Node } from 'structs/node';
import { Relation } from 'structs/relation';
import { Way } from 'structs/way';

import { Tags } from 'structs/tags';

class Index {
  private point: {};
  private vertex: {};
  private line: {};
  private area: {};
  private relation: {};
  constructor(o: {} = {}) {
    this.point = o;
    this.vertex = o;
    this.line = o;
    this.area = o;
    this.relation = o;
  }
  set(g: Geometry, value: {}) {
    if (g === Geometry.POINT) {
      this.point = value;
    } else if (g === Geometry.VERTEX || g === Geometry.VERTEX_SHARED) {
      /**
       * @NOTE vertex_shared doesn't exist in iD.
       *  maybe this work or not?
       * @REVISIT ?
       */
      this.vertex = value;
    } else if (g === Geometry.LINE) {
      this.line = value;
    } else if (g === Geometry.AREA) {
      this.area = value;
    } else if (g === Geometry.RELATION) {
      this.relation = value;
    } else {
      throw new Error('geometry type not found');
    }
  }
  get(g: Geometry) {
    if (g === Geometry.POINT) {
      return this.point;
    } else if (g === Geometry.VERTEX || g === Geometry.VERTEX_SHARED) {
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

export function initPresets(d: {} = data.presets) {
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

export const presetsMatcherPoint = weakCache((tags: Tags) =>
  presetsMatch(presets.all, presets.index, areaKeys, Geometry.POINT, tags)
);

export const presetsMatcherVertex = weakCache((tags: Tags) =>
  presetsMatch(presets.all, presets.index, areaKeys, Geometry.VERTEX, tags)
);

export const presetsMatcherLine = weakCache((tags: Tags) =>
  presetsMatch(presets.all, presets.index, areaKeys, Geometry.LINE, tags)
);

export const presetsMatcherAREA = weakCache((tags: Tags) =>
  presetsMatch(presets.all, presets.index, areaKeys, Geometry.AREA, tags)
);

export const presetsMatcherVertexShared = weakCache((tags: Tags) =>
  presetsMatch(
    presets.all,
    presets.index,
    areaKeys,
    Geometry.VERTEX_SHARED,
    tags
  )
);

export const presetsMatcherCached = (geometry: Geometry) => {
  if (geometry === Geometry.POINT) {
    return presetsMatcherPoint;
  }
  if (geometry === Geometry.VERTEX) {
    return presetsMatcherVertex;
  }
  if (geometry === Geometry.VERTEX_SHARED) {
    return presetsMatcherVertexShared;
  }
  if (geometry === Geometry.LINE) {
    return presetsMatcherLine;
  }
  if (geometry === Geometry.AREA) {
    return presetsMatcherAREA;
  }
};
