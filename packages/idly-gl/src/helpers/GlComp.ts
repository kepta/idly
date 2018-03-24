import { Component } from './Component';

export interface PRender {
  source:
    | undefined
    | {
        type: 'geojson';
        data: Record<string, any>;
      };
  layers: Record<string, undefined | Record<string, any>>;
}

export abstract class GlComp<
  Props,
  State,
  C extends Record<string, Component<any, any, any, any>>,
  RenderType extends PRender
> extends Component<Props, State, C, RenderType> {
  protected glInstance: any;

  private prevRender?: RenderType;
  private id: string;
  private beforeLayer?: string;
  private emptyData: object;
  constructor(
    props: Props,
    state: State,
    glInstance: any,
    id: string,
    beforeLayer?: string,
    emptyData = {
      type: 'FeatureCollection',
      features: [],
    }
  ) {
    super(props, state);
    this.glInstance = glInstance;
    this.beforeLayer = beforeLayer;
    this.id = id;
    this.emptyData = emptyData;
  }

  public componentWillUnMount() {
    super.componentWillUnMount();
    if (this.prevRender) {
      Object.keys(this.prevRender.layers).forEach(l =>
        this.safeRemoveLayer(`${this.id}-${l}`)
      );
    }
    this.safeRemoveSource(this.id);
  }

  protected processRender(_: any, __: any, r: RenderType): void {
    this.updateSource(r);
    this.updateLayers(r);
    this.prevRender = r;
  }

  private updateSource(newRender: RenderType) {
    const source = this.safeGetSource(this.id);

    if (!newRender || !newRender.source) {
      this.safeSetData(this.id, this.emptyData, source);
      return;
    }

    if (!source) {
      this.glInstance.addSource(this.id, newRender.source);
      return;
    }

    if (
      !this.prevRender ||
      !this.prevRender.source ||
      newRender.source.data !== this.prevRender.source.data
    ) {
      this.safeSetData(this.id, newRender.source.data, source);
    }
  }

  private updateLayers(newRender: RenderType) {
    if (!this.safeGetSource(this.id)) {
      return;
    }

    if (!newRender) {
      if (this.prevRender) {
        Object.keys(this.prevRender.layers).forEach(l =>
          this.safeRemoveLayer(`${this.id}-${l}`)
        );
      }
      return;
    }

    // note: if newRender.layers[l] is undefined
    //  no new layer would be added

    if (this.prevRender) {
      for (const l of Object.keys(this.prevRender.layers)) {
        if (!newRender.layers[l]) {
          this.safeRemoveLayer(`${this.id}-${l}`);
        }
      }
    }

    for (const l of Object.keys(newRender.layers)) {
      const prevLayer = this.prevRender && this.prevRender.layers[l];
      if (!prevLayer) {
        const layer = newRender.layers[l];
        if (!layer) {
          return;
        }

        this.safeAddLayer(
          `${this.id}-${l}`,
          layer,
          layer.hasOwnProperty('beforeLayer')
            ? layer.beforeLayer
            : this.beforeLayer
        );
      }
    }
  }

  private safeGetSource(id: string): any {
    return this.glInstance.getSource(id);
  }

  private safeGetLayer(id: string): any {
    return this.glInstance.getLayer(id);
  }

  private safeAddLayer(id: string, data: any, before?: string): void {
    if (this.safeGetLayer(id) || !data) {
      return;
    }

    if (before && !this.safeGetLayer(before)) {
      console.log('couldnt find before layer', before);
      before = '';
    }

    this.glInstance.addLayer(
      {
        ...data,
        id,
        source: this.id,
      },
      before
    );
  }

  private safeRemoveLayer(id: string): void {
    if (this.safeGetLayer(id)) {
      this.glInstance.removeLayer(id);
    }
  }

  private safeRemoveSource(id: string): void {
    if (this.safeGetSource(id)) {
      this.glInstance.removeSource(id);
    }
  }

  private safeSetData(id: string, data: any, src?: any): void {
    if (!src) {
      src = this.safeGetSource(id);
    }

    if (src) {
      src.setData(data);
    }
  }
}
