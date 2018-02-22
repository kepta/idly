import { Way } from 'idly-common/lib/osm/structures';
// explicit oneway tag..

export const isOneway: (tags: Way['tags']) => boolean = (tags: Way['tags']) => {
  if (values[tags.oneway] !== undefined) {
    return values[tags.oneway];
  }
  // implied oneway tag..
  for (const key in tags) {
    if (key in osmOneWayTags && tags[key] in osmOneWayTags[key]) {
      return true;
    }
  }
  return false;
};
// tslint:disable:object-literal-key-quotes
const values: { [index: string]: boolean } = {
  '-1': true,
  '0': false,
  '1': true,
  alternating: true,
  no: false,
  reversible: true,
  yes: true,
};

export const osmOneWayTags: any = {
  aerialway: {
    chair_lift: true,
    'j-bar': true,
    magic_carpet: true,
    mixed_lift: true,
    platter: true,
    rope_tow: true,
    't-bar': true,
    yes: true,
  },
  highway: {
    motorway: true,
    motorway_link: true,
  },
  junction: {
    circular: true,
    roundabout: true,
  },
  man_made: {
    'piste:halfpipe': true,
  },
  'piste:type': {
    downhill: true,
    sled: true,
    yes: true,
  },
  waterway: {
    canal: true,
    ditch: true,
    drain: true,
    river: true,
    stream: true,
  },
};
