import { Map } from 'immutable';
export type Tags = Map<string, string>;

export function tagsFactory(obj?: object): Tags {
  return Map(obj);
}

export function osmIsInterestingTag(key) {
  return (
    key !== 'attribution' &&
    key !== 'created_by' &&
    key !== 'source' &&
    key !== 'odbl' &&
    key.indexOf('tiger:') !== 0
  );
}

export const osmOneWayTags = {
  aerialway: {
    chair_lift: true,
    mixed_lift: true,
    't-bar': true,
    'j-bar': true,
    platter: true,
    rope_tow: true,
    magic_carpet: true,
    yes: true
  },
  highway: {
    motorway: true,
    motorway_link: true
  },
  junction: {
    roundabout: true
  },
  man_made: {
    'piste:halfpipe': true
  },
  'piste:type': {
    downhill: true,
    sled: true,
    yes: true
  },
  waterway: {
    canal: true,
    ditch: true,
    drain: true,
    river: true,
    stream: true
  }
};

export const osmPavedTags = {
  surface: {
    paved: true,
    asphalt: true,
    concrete: true
  },
  tracktype: {
    grade1: true
  }
};
