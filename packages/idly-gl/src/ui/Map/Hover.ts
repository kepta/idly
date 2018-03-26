import { HOVER_WIDTH } from '../../configuration';
import { ComponentUpdateType } from '../../helpers/Component';
import { GlComp } from '../../helpers/GlComp';

export interface Props {
  features?:
    | Array<{ id?: any; properties: any; geometry: any }>
    | Promise<Array<{ id?: any; properties: any; geometry: any }>>;
}

const color = '#fbb03b';

export class Hover extends GlComp<Props, {}, any, any> {
  constructor(props: Props, gl: any, beforeLayer?: string) {
    super(props, {}, gl, 'hover-layer', beforeLayer);
    this.mount();
  }

  protected shouldComponentUpdate({
    prev,
    next,
  }: ComponentUpdateType<Props, {}>) {
    return prev.props.features !== next.props.features;
  }

  protected async render(props: Props) {
    const features = await props.features;

    if (!features || features.length === 0) {
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
        circle: {
          type: 'circle',
          paint: {
            'circle-radius': HOVER_WIDTH.point,
            'circle-color': color,
          },
          filter: ['==', '$type', 'Point'],
        },
        areaFill: {
          type: 'fill',
          paint: {
            'fill-color': color,
            'fill-outline-color': color,
            'fill-opacity': 0.1,
          },
          filter: ['==', '$type', 'Polygon'],
        },
        areaBorder: {
          beforeLayer: undefined,
          type: 'line',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            'line-round-limit': 0.5,
          },
          paint: {
            'line-color': color,
            'line-opacity': 0.8,
            'line-width': HOVER_WIDTH.area,
            'line-offset': -6,
          },
          filter: ['==', '$type', 'Polygon'],
        },
        line: {
          type: 'line',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': color,
            'line-width': HOVER_WIDTH.line,
          },
          filter: ['==', '$type', 'LineString'],
        },
      },
    };
  }
}
