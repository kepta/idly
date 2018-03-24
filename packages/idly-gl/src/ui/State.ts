import { Entity } from 'idly-common/lib/osm/structures';
import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';
import { LayerOpacity } from '../helpers/layerOpacity';

export const enum MainTabs {
  Tags = 'Tags',
  Presets = 'Presets',
  Relations = 'Relations',
  Layers = 'Layers',
}

export interface State {
  mainTab: {
    active: MainTabs;
  };
  tags: {};
  selectEntity: {
    hoverId?: string;
    selectedId?: string;
    beforeLayers: { top: string; middle: string; last: string };
  };
  map: {
    loading: boolean;
    layers: any[]; // the gl layers
    quadkeys: string[]; // quadkeys in view
    featureCollection?: GetQuadkey['response'];
    beforeLayer?: string;
    layerOpacity: LayerOpacity;
  };
}
