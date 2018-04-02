import { Component, ComponentUpdateType } from '../helpers/Component';
import { Store } from '../store/index';
import { visibleGlLayers } from '../store/map.derived';

export interface Props {
  layers: Store['map']['layers'];
}

export class OsmLayers extends Component<Props, {}> {
  private gl: any;
  private sourceId: string;
  private prevLayers: Store['map']['layers'];
  private beforeLayer?: string;
  constructor(props: Props, gl: any, sourceId: string, beforeLayer?: string) {
    super(props, {});
    this.sourceId = sourceId;
    this.gl = gl;
    this.prevLayers = [];

    this.beforeLayer = this.checkBeforeLayer(beforeLayer);

    if (this.gl.getSource(this.sourceId)) {
      this.getGlLayer(props.layers).forEach(l => {
        if (!this.gl.getLayer(l.id)) {
          this.gl.addLayer(l, this.beforeLayer);
        }
      });
    }
    this.mount();
  }

  public componentWillUnMount() {
    super.componentWillUnMount();
    if (this.gl.getSource(this.sourceId)) {
      this.getGlLayer(this.props.layers).forEach(l => {
        if (this.gl.getLayer(l.id)) {
          this.gl.removeLayer(l.id);
        } else {
          console.log('no layer found', l.id);
        }
      });
    }
  }

  protected shouldComponentUpdate({
    prev,
    next,
  }: ComponentUpdateType<Props, {}>) {
    return next.props.layers !== prev.props.layers;
  }

  protected render(props: Props) {
    if (this.gl.getSource(this.sourceId)) {
      this.prevLayers.forEach(l => {
        if (this.gl.getLayer(l.layer.id)) {
          this.gl.removeLayer(l.layer.id);
        }
      });

      this.beforeLayer = this.checkBeforeLayer(this.beforeLayer);

      this.getGlLayer(props.layers).forEach(l => {
        if (!this.gl.getLayer(l.id)) {
          this.gl.addLayer(l, this.beforeLayer);
        }
      });

      this.prevLayers = props.layers;
    }
  }

  private getGlLayer = (layers: Props['layers']) => {
    return visibleGlLayers(layers);
  };

  private checkBeforeLayer = (layer?: string) => {
    if (!layer) {
      return undefined;
    }
    if (this.gl.getLayer(layer)) {
      return layer;
    }
    return undefined;
  };
}
