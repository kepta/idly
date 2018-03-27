import { BASE_SOURCE } from '../configuration';
import { Component, ComponentUpdateType } from '../helpers/Component';
import { Store } from '../store/index';
import { OsmLayers } from './OsmLayers';

export interface Props {
  layers: Store['map']['layers'];
  featureCollection: Store['map']['featureCollection'];
}

export class Osm extends Component<Props, {}> {
  protected children: {
    osmLayerComp: OsmLayers;
  };

  private gl: any;
  private prevFc: Store['map']['featureCollection'];

  constructor(props: Props, gl: any) {
    super(props, {});

    this.gl = gl;

    if (!this.gl.getSource(BASE_SOURCE)) {
      this.gl.addSource(BASE_SOURCE, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
    }

    this.prevFc = props.featureCollection;

    this.children = {
      osmLayerComp: new OsmLayers({ layers: props.layers }, gl, BASE_SOURCE),
    };

    this.mount();
  }

  public componentWillUnMount() {
    super.componentWillUnMount();

    if (this.gl.getSource(BASE_SOURCE)) {
      this.gl.removeSource(BASE_SOURCE);
    }
  }

  protected componentWillUpdate() {
    return;
  }

  protected shouldComponentUpdate({
    prev,
    next,
  }: ComponentUpdateType<Props, {}>) {
    return (
      next.props.featureCollection !== prev.props.featureCollection ||
      next.props.layers !== prev.props.layers
    );
  }

  protected render(props: Props) {
    const fc = props.featureCollection || {
      type: 'FeatureCollection',
      features: [],
    };

    const source = this.gl.getSource(BASE_SOURCE);

    this.children.osmLayerComp.setProps({ layers: props.layers });

    if (source && fc !== this.prevFc) {
      source.setData(fc);
    }

    this.prevFc = fc;
  }
}
