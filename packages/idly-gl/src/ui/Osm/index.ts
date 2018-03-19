import { FeatureCollection } from '@turf/helpers';
import { BASE_SOURCE } from '../../configuration';
import { Component } from '../../helpers/Component';
import { makeQuadkey2$ } from '../../streams';
import { State } from '../State';

export interface Props {
  featureCollection?: FeatureCollection<
    any,
    {
      [name: string]: any;
    }
  >;
}

export class Osm extends Component<Props, {}, void> {
  protected state = {};

  private gl: any;
  private layers: any[];
  private source: any;

  constructor(
    props: Props,
    gl: any,
    layers: any[],
    changeQuadkeys: (d: State['map']['quadkeys']) => void
  ) {
    super(props);

    this.gl = gl;
    this.layers = layers;

    this.gl.addSource(BASE_SOURCE, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    this.source = this.gl.getSource(BASE_SOURCE);

    this.layers.forEach(l => this.gl.addLayer(l));

    makeQuadkey2$(this.gl).forEach(r => {
      changeQuadkeys(r);
    });
  }

  public componentWillUnMount() {
    this.layers.forEach(l => this.gl.removeLayer(l.id));
    this.gl.removeSource(BASE_SOURCE);
  }

  protected render() {
    const fc = this.props.featureCollection;

    console.log('rendering', fc && fc.features.length);

    if (!fc) {
      return this.source.setData({
        type: 'FeatureCollection',
        features: [],
      });
    }

    this.source.setData(fc);
  }

  protected shouldComponentUpdate(nextProps: Props) {
    if (nextProps.featureCollection !== this.props.featureCollection) {
      return true;
    }
    return false;
  }
}
