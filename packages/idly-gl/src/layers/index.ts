import { BASE_SOURCE } from '../configuration';
import { getNameSpacedLayerId } from '../helpers/helpers';
import area from './area';
import extrusion from './extrusion';
import highway from './highway';
import interactive from './interactive';
import labels from './label';
import placeholder from './misc/placeholder';
import nonInteractive from './nonInteractive';
import point from './point';
import rail from './rail';
import relations from './relations';
import { Layer } from './types';
import waterway from './waterway';

const layers: Layer[] = [
  ...area,
  ...extrusion,
  ...highway,
  ...rail,
  ...waterway,
  ...nonInteractive,
  ...labels,
  ...point,
  ...interactive,
  ...relations,
  ...placeholder,
]
  .sort((a, b) => a.priority - b.priority)
  .map(l => ({
    ...l,
    layer: {
      ...l.layer,
      source: BASE_SOURCE,
      id: getNameSpacedLayerId(l.layer.id, BASE_SOURCE),
    },
  }));

export default layers;

if (layers.some(r => !(r.priority < 10 && r.priority >= 0))) {
  throw new Error('priority must be 0 <= p < 10');
}
