import { presetIndex } from '../presets/presetIndex';

let areaKeys;

export function getAreaKeys() {
  if (!areaKeys) {
    areaKeys = presetIndex()
      .init()
      .areaKeys();
  }
  return areaKeys;
}
