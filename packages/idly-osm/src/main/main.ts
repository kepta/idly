import { EntityType, FeatureProps } from 'idly-common/lib/osm/structures';

import { PLUGIN_NAME } from '../config/config';
import { onParseEntities } from '../worker';
import { TestOsm } from '../ui/Test';

export interface Plugin {
  name: string;
  description: string;
  uiComponents: any[];
  workers: any[];
  actions: any[];
}

// @TODO separate workers,
//  for a smaller build
export var plugin: Plugin = {
  name: PLUGIN_NAME,
  description: 'Core osm functionality for jalebi editor',
  uiComponents: [TestOsm],
  actions: [],
  workers: [onParseEntities]
};
