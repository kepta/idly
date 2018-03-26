import { derivedVisibleLayers } from '../../derived';
import { Component, ComponentUpdateType } from '../../helpers/Component';
import { State } from '../State';

export interface Props {
  layers: State['map']['layers'];
}

export class OsmLayers extends Component<Props, {}, any, any> {
  private gl: any;
  private sourceId: string;
  private prevLayers: State['map']['layers'];

  constructor(props: Props, gl: any, sourceId: string) {
    super(props, {});
    this.sourceId = sourceId;
    this.gl = gl;
    this.prevLayers = [];

    const layers = derivedVisibleLayers(props.layers)
      .sort((a, b) => a.priority - b.priority)
      .map(r => r.layer);

    if (this.gl.getSource(this.sourceId)) {
      layers.forEach(l => {
        if (!this.gl.getLayer(l.id)) {
          this.gl.addLayer(l);
        }
      });
    }

    this.mount();
  }

  public componentWillUnMount() {
    super.componentWillUnMount();
    if (this.gl.getSource(this.sourceId)) {
      this.props.layers.forEach(l => {
        if (this.gl.getLayer(l.id)) {
          this.gl.removeLayer(l.id);
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
    const layers = derivedVisibleLayers(props.layers)
      .sort((a, b) => a.priority - b.priority)
      .map(r => r.layer);

    if (this.gl.getSource(this.sourceId)) {
      this.prevLayers.forEach(l => {
        if (this.gl.getLayer(l.id)) {
          this.gl.removeLayer(l.id);
        }
      });

      layers.forEach(l => {
        if (!this.gl.getLayer(l.id)) {
          this.gl.addLayer(l);
        }
      });

      this.prevLayers = layers;
    }
  }
}
