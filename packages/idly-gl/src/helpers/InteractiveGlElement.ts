import { Component } from './Component';

export abstract class InteractiveGlElement<P, S> extends Component<
  P,
  S,
  object | undefined | null
> {
  protected abstract glInstance: any;

  private prevRender: any;
  private source: any;
  private id: string;
  private beforeLayer?: string;

  constructor(props: P, id: string, beforeLayer?: string) {
    super(props);
    this.beforeLayer = beforeLayer;
    this.id = id;
  }

  public setProps(newProps: P) {
    if (this.shouldComponentUpdate(newProps, this.state)) {
      this.props = newProps;
      const newRender = this.render();

      this.processRender(newRender);
      this.prevRender = newRender;
    }
  }

  private processRender(newRender: any) {
    this.updateSource(newRender);
    this.updateLayers(newRender);
  }

  private updateSource(newRender: any) {
    if (!newRender) {
      return;
    }

    if (!this.source) {
      this.glInstance.addSource(this.id, newRender.source);
      this.source = this.glInstance.getSource(this.id);
      return;
    }

    if (
      !this.prevRender ||
      !this.prevRender.source ||
      newRender.source.data !== this.prevRender.source.data
    ) {
      this.source.setData(newRender.source.data);
    }
  }

  private updateLayers(newRender: any) {
    if (!this.source) {
      return;
    }

    if (!newRender) {
      if (this.prevRender) {
        Object.keys(this.prevRender.layers).forEach(l =>
          this.glInstance.removeLayer(`${this.id}-${l}`)
        );
      }
      return;
    }

    if (!this.prevRender) {
      Object.keys(newRender.layers).forEach(l => {
        this.glInstance.addLayer(
          {
            ...newRender.layers[l],
            id: `${this.id}-${l}`,
            source: this.id,
          },
          newRender.layers[l].hasOwnProperty('beforeLayer')
            ? newRender.layers[l].beforeLayer
            : this.beforeLayer
        );
      });
      return;
    }

    for (const prevId of Object.keys(this.prevRender.layers)) {
      if (!newRender.layers[prevId]) {
        this.glInstance.removeLayer(`${this.id}-${prevId}`);
      }
    }

    for (const id of Object.keys(newRender.layers)) {
      if (newRender.layers[id] && !this.prevRender.layers[id]) {
        this.glInstance.addLayer(
          {
            ...newRender.layers[id],
            id: `${this.id}-${id}`,
            source: this.id,
          },
          newRender.layers[id].hasOwnProperty('beforeLayer')
            ? newRender.layers[id].beforeLayer
            : this.beforeLayer
        );
      }
    }
  }

  // private addLayer(newLayer) {
  //   this.glInstance.addLayer(
  //     {
  //       ...newRender.layers[l],
  //       id: `${this.id}-${l}`,
  //       source: this.id,
  //     },
  //     newRender.layers[l].hasOwnProperty('beforeLayer')
  //       ? newRender.layers[l].beforeLayer
  //       : this.beforeLayer
  //   );
  // }
}
