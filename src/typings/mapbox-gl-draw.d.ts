declare module '@mapbox/mapbox-gl-draw' {
  class Draw {
    constructor(x: Object);
    on(type: string, listener: Function): this;

    on(type: string, layer: string, listener: Function): this;

    off(type?: string | any, listener?: Function): this;

    off(type?: string | any, layer?: string, listener?: Function): this;

    once(type: string, listener: Function): this;

    fire(type: string, data?: mapboxgl.EventData | Object): this;

    listens(type: string): boolean;
    draw(k: any): void;
    add(k: any): void;
  }
  export = Draw;
}
