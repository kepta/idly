import { Map } from 'immutable';
import * as _ from 'lodash';

export type AreaKeys = Map<string, Map<string, boolean>>;

export function initAreaKeys(all): AreaKeys {
  let localAreaKeys: AreaKeys = Map();
  const ignore = ['barrier', 'highway', 'footway', 'railway', 'type']; // probably a line..
  // all . collection needs to init
  const presets = _.reject(all.collection, 'suggestion');

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
