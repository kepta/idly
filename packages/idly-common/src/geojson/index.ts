export {
  entityToGeoJson,
  getCoordsFromTable,
  nodeCombiner,
  wayCombiner,
  wayToLineString,
} from './entityToGeojson';

export {
  applyNodeMarkup,
  DEFAULT_NODE_ICON,
  nodePropertiesGen,
} from './nodeProps';

export { onParseEntities, PLUGIN_NAME } from './onParseEntities';
export { presetMatch, all } from './presetMatch';
export { wayPropertiesGen } from './wayProps';
