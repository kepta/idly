import { List } from 'immutable';
import { IRecord, recordFactory } from 'map/utils/recordFactory';
import * as R from 'ramda';

export type LayerFilters = List<string | List<any>>;

interface ILayerGL {
  visibility?: 'visible' | 'none';
  priority?: number; // this is custom, will be removed before sending to gl
  id: string;
  type:
    | 'fill'
    | 'line'
    | 'symbol'
    | 'circle'
    | 'fill-extrusion'
    | 'raster'
    | 'background';

  metadata?: any;
  ref?: string;
  source: string;
  'source-layer'?: string;
  minzoom?: number;
  maxzoom?: number;
  interactive?: boolean;
  filter: LayerFilters;
  layout?: any;
  paint?: any;
}

const defaultState: ILayerGL = {
  visibility: 'visible',
  priority: -1,
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
export const partialLayerSpec = recordFactory<Partial<ILayerGL>>(
  defaultState,
  'layerRecord'
);

// export const LayerSpecCurriedSource = R.curry(
//   (d: Partial<ILayerGL>, source: string) =>
//     recordFactory<Partial<ILayerGL>>(
//       Object.assign({}, d, { source }),
//       'layerRecord'
//     )
// );

export type ILayerSpec = IRecord<ILayerGL>;
