import { OsmGeometry, Tags, weakCache } from 'idly-common/lib';
import { presetsData } from 'idly-data/lib';
import { Map as ImmutableMap } from 'immutable';
import * as _ from 'lodash';

import { presetCategory } from '../presets/category';
import { presetCollection } from '../presets/collection';
import { presetField } from '../presets/field';
import { presetPreset } from '../presets/preset';

import { initAreaKeys } from '../presets/areaKeys';
import { presetsMatch } from '../presets/match';

export class Index {
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
  set(g: OsmGeometry, value: {}) {
    if (g === OsmGeometry.POINT) {
      this.point = value;
    } else if (g === OsmGeometry.VERTEX || g === OsmGeometry.VERTEX_SHARED) {
      /**
       * @NOTE vertex_shared doesn't exist in iD.
       *  maybe this work or not?
       * @REVISIT ?
       */
      this.vertex = value;
    } else if (g === OsmGeometry.LINE) {
      this.line = value;
    } else if (g === OsmGeometry.AREA) {
      this.area = value;
    } else if (g === OsmGeometry.RELATION) {
      this.relation = value;
    } else {
      throw new Error('geometry type not found');
    }
  }
  get(g: OsmGeometry) {
    if (g === OsmGeometry.POINT) {
      return this.point;
    } else if (g === OsmGeometry.VERTEX || g === OsmGeometry.VERTEX_SHARED) {
      return this.vertex;
    } else if (g === OsmGeometry.LINE) {
      return this.line;
    } else if (g === OsmGeometry.AREA) {
      return this.area;
    } else if (g === OsmGeometry.RELATION) {
      return this.relation;
    } else {
      throw new Error('type not found');
    }
  }
}

export function initPresets(d: {} = presetsData.presets) {
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
    defaults.set(
      OsmGeometry.AREA,
      presetCollection(d.defaults.area.map(getItem))
    );
    defaults.set(
      OsmGeometry.LINE,
      presetCollection(d.defaults.line.map(getItem))
    );
    defaults.set(
      OsmGeometry.POINT,
      presetCollection(d.defaults.point.map(getItem))
    );
    defaults.set(
      OsmGeometry.VERTEX,
      presetCollection(d.defaults.vertex.map(getItem))
    );
    defaults.set(
      OsmGeometry.RELATION,
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

export const presetsMatcher = (geometry: OsmGeometry, tags: Tags) =>
  presetsMatch(presets.all, presets.index, areaKeys, geometry, tags);

export const presetsMatcherPoint = weakCache((tags: Tags) =>
  presetsMatch(presets.all, presets.index, areaKeys, OsmGeometry.POINT, tags)
);

export const presetsMatcherVertex = weakCache((tags: Tags) =>
  presetsMatch(presets.all, presets.index, areaKeys, OsmGeometry.VERTEX, tags)
);

export const presetsMatcherLine = weakCache((tags: Tags) =>
  presetsMatch(presets.all, presets.index, areaKeys, OsmGeometry.LINE, tags)
);

export const presetsMatcherAREA = weakCache((tags: Tags) =>
  presetsMatch(presets.all, presets.index, areaKeys, OsmGeometry.AREA, tags)
);

export const presetsMatcherVertexShared = weakCache((tags: Tags) =>
  presetsMatch(
    presets.all,
    presets.index,
    areaKeys,
    OsmGeometry.VERTEX_SHARED,
    tags
  )
);

export const presetsMatcherCached = (geometry: OsmGeometry) => {
  if (geometry === OsmGeometry.POINT) {
    return presetsMatcherPoint;
  }
  if (geometry === OsmGeometry.VERTEX) {
    return presetsMatcherVertex;
  }
  if (geometry === OsmGeometry.VERTEX_SHARED) {
    return presetsMatcherVertexShared;
  }
  if (geometry === OsmGeometry.LINE) {
    return presetsMatcherLine;
  }
  if (geometry === OsmGeometry.AREA) {
    return presetsMatcherAREA;
  }
};
