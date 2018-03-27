export interface Layer {
  selectable: boolean;
  internal?: boolean;
  hide?: boolean;
  priority: number;
  layer: {
    id: string;
    minzoom?: number;
    type: string; // 'line' | 'fill-extrusion' | 'point' | 'circle' | 'symbol' | 'fill';
    source: undefined | string;
    layout?: Record<string, any>;
    paint: Record<string, any>;
    filter: any[];
  };
}
