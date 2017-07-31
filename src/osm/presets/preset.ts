import * as _ from 'lodash';

import { Entity } from 'osm/entities/entities';
import { t } from 'osm/presets/t';

const areaKeys = {};

export function presetPreset(id, preset, fields?: any) {
  preset = _.clone(preset);

  preset.id = id;
  preset.fields = (preset.fields || []).map(getFields);
  preset.geometry = preset.geometry || [];

  function getFields(f) {
    return fields[f];
  }

  preset.matchGeometry = function(geometry) {
    return preset.geometry.indexOf(geometry) >= 0;
  };

  preset.originalScore = preset.matchScore || 1;

  preset.matchScore = function(entity: Entity): number {
    const tags = preset.tags;
    let score = 0;

    for (const tt in tags) {
      if (entity.tags.get(tt) === tags[tt]) {
        score += preset.originalScore;
      } else if (tags[tt] === '*' && entity.tags.has(tt)) {
        score += preset.originalScore / 2;
      } else {
        return -1;
      }
    }

    return score;
  };

  preset.t = function(scope, options) {
    return t('presets.presets.' + id + '.' + scope, options);
  };

  const name = preset.name || '';
  preset.name = function() {
    if (preset.suggestion) {
      id = id.split('/');
      id = id[0] + '/' + id[1];
      return name + ' - ' + t('presets.presets.' + id + '.name');
    }
    return preset.t('name', { default: name });
  };

  preset.terms = function() {
    return preset
      .t('terms', { default: '' })
      .toLowerCase()
      .trim()
      .split(/\s*,+\s*/);
  };

  preset.isFallback = function() {
    const tagCount = Object.keys(preset.tags).length;
    return (
      tagCount === 0 || (tagCount === 1 && preset.tags.hasOwnProperty('area'))
    );
  };

  const reference = preset.reference || {};
  preset.reference = function(geometry) {
    let key = reference.key || Object.keys(_.omit(preset.tags, 'name'))[0];
    let value = reference.value || preset.tags[key];

    if (geometry === 'relation' && key === 'type') {
      if (value in preset.tags) {
        key = value;
        value = preset.tags[key];
      } else {
        return { rtype: value };
      }
    }

    if (value === '*') {
      return { key };
    } else {
      return { key, value };
    }
  };

  const removeTags = preset.removeTags || preset.tags;
  preset.removeTags = function(tags, geometry) {
    tags = _.omit(tags, _.keys(removeTags));

    for (const f in preset.fields) {
      if (f) {
        const field = preset.fields[f];
        if (
          field.matchGeometry(geometry) &&
          field.default === tags[field.key]
        ) {
          delete tags[field.key];
        }
      }
    }

    delete tags.area;
    return tags;
  };

  const applyTags = preset.addTags || preset.tags;
  preset.applyTags = function(tags, geometry) {
    let k;

    tags = _.clone(tags);

    for (k in applyTags) {
      if (applyTags[k] === '*') {
        tags[k] = 'yes';
      } else {
        tags[k] = applyTags[k];
      }
    }

    // Add area=yes if necessary.
    // This is necessary if the geometry is already an area (e.g. user drew an area) AND any of:
    // 1. chosen preset could be either an area or a line (`barrier=city_wall`)
    // 2. chosen preset doesn't have a key in areaKeys (`railway=station`)
    delete tags.area;
    if (geometry === 'area') {
      let needsAreaTag = true;
      if (preset.geometry.indexOf('line') === -1) {
        for (k in applyTags) {
          if (k in areaKeys) {
            needsAreaTag = false;
            break;
          }
        }
      }
      if (needsAreaTag) {
        tags.area = 'yes';
      }
    }

    for (const f in preset.fields) {
      if (f) {
        const field = preset.fields[f];
        if (
          field.matchGeometry(geometry) &&
          field.key &&
          !tags[field.key] &&
          field.default
        ) {
          tags[field.key] = field.default;
        }
      }
    }

    return tags;
  };

  return preset;
}
