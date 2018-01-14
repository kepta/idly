import { osmPavedTags } from 'idly-data/lib/osmPavedTags';
import { Tags } from '../osm/structures';

const primaries = [
  'building',
  'highway',
  'railway',
  'waterway',
  'aeroway',
  'motorway',
  'boundary',
  'power',
  'amenity',
  'natural',
  'landuse',
  'leisure',
  'military',
  'place',
];

const statuses = [
  'proposed',
  'construction',
  'disused',
  'abandoned',
  'dismantled',
  'razed',
  'demolished',
  'obliterated',
];

const secondaries = [
  'oneway',
  'bridge',
  'tunnel',
  'embankment',
  'cutting',
  'barrier',
  'surface',
  'tracktype',
  'crossing',
  'service',
  'sport',
];

export const tagClassesPrimary = (tags: Tags) => {
  let classes = '';
  let primary;
  let status;

  let i;
  let key;
  let value;

  // pick at most one primary classification tag..
  for (i = 0; i < primaries.length; i++) {
    key = primaries[i];
    value = tags[key];
    if (!value || value === 'no') {
      continue;
    }

    primary = key;
    if (statuses.indexOf(value) !== -1) {
      // e.g. `railway=abandoned`
      status = value;
      classes += ' tag-' + key;
    } else {
      classes += ' tag-' + key + ' tag-' + key + '-' + value;
    }

    break;
  }
  return classes.trim().split(' ');
};

export function tagClasses(tags: Tags) {
  let classes = '';
  let primary;
  let status;

  let i;
  let key;
  let value;

  // pick at most one primary classification tag..
  for (i = 0; i < primaries.length; i++) {
    key = primaries[i];
    value = tags[key];
    if (!value || value === 'no') {
      continue;
    }

    primary = key;
    if (statuses.indexOf(value) !== -1) {
      // e.g. `railway=abandoned`
      status = value;
      classes += ' tag-' + key;
    } else {
      classes += ' tag-' + key + ' tag-' + key + '-' + value;
    }

    break;
  }

  // add at most one status tag, only if relates to primary tag..
  if (!status) {
    for (i = 0; i < statuses.length; i++) {
      key = statuses[i];
      value = tags[key];
      if (!value || value === 'no') {
        continue;
      }

      if (value === 'yes') {
        // e.g. `railway=rail + abandoned=yes`
        status = key;
      } else if (primary && primary === value) {
        // e.g. `railway=rail + abandoned=railway`
        status = key;
      } else if (!primary && primaries.indexOf(value) !== -1) {
        // e.g. `abandoned=railway`
        status = key;
        primary = value;
        classes += ' tag-' + value;
      } // else ignore e.g.  `highway=path + abandoned=railway`

      if (status) {
        break;
      }
    }
  }

  if (status) {
    classes += ' tag-status tag-status-' + status;
  }

  // add any secondary (structure) tags
  for (i = 0; i < secondaries.length; i++) {
    key = secondaries[i];
    value = tags[key];
    if (!value || value === 'no') {
      continue;
    }
    classes += ' tag-' + key + ' tag-' + key + '-' + value;
  }

  // For highways, look for surface tagging..
  if (primary === 'highway') {
    let paved = tags.highway !== 'track';
    for (const k in tags) {
      const v = tags[k];

      if (osmPavedTags.hasOwnProperty(k)) {
        paved = !!(osmPavedTags as any)[k][v];
        break;
      }
    }
    if (!paved) {
      classes += ' tag-unpaved';
    }
  }

  classes = classes.trim();
  return classes;
}
