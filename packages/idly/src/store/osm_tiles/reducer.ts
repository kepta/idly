import { Record } from 'immutable';
import { Action } from 'src/store/actions';
const SphericalMercator = require('@mapbox/sphericalmercator');

var mercator = new SphericalMercator({
  size: 256
});

const initialState = {
  oAuthToken: '',
  oAuthTokenSecret: ''
};

export class OsmTilesState extends Record(initialState) {
  oAuthToken: string;
  oAuthTokenSecret: string;
}
const osmTilesState = new OsmTilesState();

export function osmReducer(state = osmTilesState, action: Action<any>) {
  switch (action.type) {
    default:
      return state;
  }
}
var win: any = window;
win.Record = Record;
