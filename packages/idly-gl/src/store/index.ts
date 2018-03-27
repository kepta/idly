import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';
import { LayerOpacity } from '../helpers/layerOpacity';
import { Layer } from '../layers/types';

export const enum MainTabs {
  Tags = 'Tags',
  Relations = 'Relations',
  Layers = 'Layers',
}

export interface Store {
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
    layers: Layer[]; // the gl layers
    quadkeys: string[]; // quadkeys in view
    featureCollection: GetQuadkey['response'];
    beforeLayer?: string;
    layerOpacity: LayerOpacity;
  };
}
