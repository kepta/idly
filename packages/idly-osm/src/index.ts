import { EntityType, FeatureProps } from 'idly-common/lib/osm/structures';

import { onParseEntities, onParseEntities2 } from './worker';
import { TestOsm } from './ui/Test';

export const PLUGIN_NAME = 'osm_basic';
export interface Plugin {
  name: string;
  description: string;
  uiComponents: any[];
  workers: any[];
  actions: any[];
}

export var plugin: Plugin = {
  name: PLUGIN_NAME,
  description: 'Core osm functionality for jalebi editor',
  uiComponents: [TestOsm],
  actions: [],
  workers: [onParseEntities]
};
export default plugin;
