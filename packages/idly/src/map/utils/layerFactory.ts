import { List } from 'immutable';
import { IRecord, recordFactory } from 'map/utils/recordFactory';

export type LayerFilters = List<string | List<any>>;

interface ILayerGL {
  id: string;
  type?:
    | 'fill'
    | 'line'
    | 'symbol'
    | 'circle'
    | 'fill-extrusion'
    | 'raster'
    | 'background';

  metadata?: any;
  ref?: string;
  source?: string;
  'source-layer'?: string;
  minzoom?: number;
  maxzoom?: number;
  interactive?: boolean;
  filter?: LayerFilters;
  layout?: any;
  paint?: any;
}

const defaultState: ILayerGL = {
  id: '',
  type: undefined,
  metadata: undefined,
  ref: undefined,
  source: undefined,
  'source-layer': undefined,
  minzoom: undefined,
  maxzoom: undefined,
  interactive: undefined,
  filter: undefined,
  layout: undefined,
  paint: undefined
};

export const LayerSpec = recordFactory<ILayerGL>(defaultState, 'layerRecord');

export type ILayerSpec = IRecord<ILayerGL>;
