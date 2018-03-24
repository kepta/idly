import { OsmGeometry } from 'idly-common/lib/osm/structures';
import { IDLY_NS } from '../../constants';
import { ComponentUpdateType } from '../../helpers/Component';
import { GlComp } from '../../helpers/GlComp';

export interface Props {
  features?:
    | Array<{ id?: any; properties: any; geometry: any }>
    | Promise<Array<{ id?: any; properties: any; geometry: any }>>;
}

export class Select extends GlComp<Props, {}, any, any> {
  constructor(props: Props, gl: any, beforeLayer?: string) {
    super(props, {}, gl, 'select-layer', beforeLayer);

    this.mount();
  }

  protected shouldComponentUpdate({
    prev,
    next,
  }: ComponentUpdateType<Props, {}>) {
    return prev.props.features !== next.props.features;
  }

  protected async render(props: Props) {
    const { features } = props;

    if (!features) {
      return null;
    }

    return {
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: await features,
        },
      },
      layers: {
        circleo: {
          type: 'circle',
          paint: {
            'circle-radius': 16,
            'circle-color': '#00f9ff',
          },
          filter: ['==', '$type', 'Point'],
        },
        fill: {
          type: 'fill',
          paint: {
            'fill-color': '#00f9ff',
            'fill-outline-color': '#00f9ff',
            'fill-opacity': 0.1,
          },
          filter: ['==', '$type', 'Polygon'],
        },
        dash: {
          beforeLayer: undefined,
          type: 'line',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            'line-round-limit': 0.5,
          },
          paint: {
            'line-color': '#00f9ff',
            'line-opacity': 0.8,
            'line-width': 12,
            'line-offset': -6,
          },
          filter: ['==', '$type', 'Polygon'],
        },
        selecto: {
          type: 'line',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#00f9ff',
            'line-width': 22,
          },
          filter: ['==', '$type', 'LineString'],
        },
      },
    };
  }
}
