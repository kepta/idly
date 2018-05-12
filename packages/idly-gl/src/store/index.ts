import { Entity } from 'idly-common/lib/osm/structures';
import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';
import { LayerOpacity } from '../helpers/layerOpacity';
import { Layer } from '../layers/types';

export const enum MainTabs {
  Info = 'Info',
  Tags = 'Tags',
  Tree = 'Tree',
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
    beforeLayers: {
      top: string | undefined;
      middle: string | undefined;
      last: string | undefined;
    };
    popup?: {
      lnglat: { lat: number; lng: number };
      ids: string[];
    };
  };
  map: {
    loading: boolean;
    layers: Layer[]; // the gl layers
    quadkeys: string[]; // quadkeys in view
    featureCollection: GetQuadkey['response'];
    beforeLayer?: string;
    layerOpacity: LayerOpacity;
    zoom: number;
  };

  entityTree?: EntityExpanded;
}

export interface EntityExpanded {
  entity: Entity;
  parentWays: RecursiveRecord;
  parentRelations: RecursiveRecord;
  children: RecursiveRecord;
}

export interface RecursiveRecord {
  [index: string]: string | EntityExpanded | undefined;
}
