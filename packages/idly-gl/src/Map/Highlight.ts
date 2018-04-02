import { HighlightColor } from 'idly-common/lib/styling/highlight';
import { HIGHLIGHT_WIDTH } from '../configuration';
import { IDLY_NS } from '../constants';
import { ComponentUpdateType } from '../helpers/Component';
import { GlComp } from '../helpers/GlComp';

export interface Props {
  features?:
    | Array<{ id?: any; properties: any; geometry: any }>
    | Promise<Array<{ id?: any; properties: any; geometry: any }>>;
}
const color = [
  'case',
  ['has', `${IDLY_NS}highlight`],
  ['get', `${IDLY_NS}highlight`],
  HighlightColor.KIND_HOVER,
];

export class Highlight extends GlComp<Props, {}, any, any> {
  constructor(
    props: Props,
    gl: any,
    beforeLayer?: string,
    layername = Math.random() + ''
  ) {
    super(props, {}, gl, 'highlight-layer-' + layername, beforeLayer);
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

    // Only works if feature provided extra
    // styling for highlighting
    if (
      !features ||
      features.length === 0 ||
      features.some(r => !r.properties.hasOwnProperty(`${IDLY_NS}highlight`))
    ) {
      return null;
    }

    return {
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      },
      layers: {
        circle: {
          type: 'circle',
          paint: {
            'circle-radius': HIGHLIGHT_WIDTH.point,
            'circle-color': color,
            'circle-opacity': 0.5,
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
            'line-opacity': 0.3,
            'line-width': HIGHLIGHT_WIDTH.area,
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
            'line-opacity': 0.5,
            'line-width': HIGHLIGHT_WIDTH.line,
          },
          filter: ['==', '$type', 'LineString'],
        },
        label: {
          beforeLayer: undefined,
          type: 'symbol',
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 350,
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-field': `{${IDLY_NS}relation-role}`, // part 2 of this is how to do it
            'text-size': 16,
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.05,
            'text-optional': true,
            'text-allow-overlap': false,
          },
          paint: {
            'text-halo-color': '#ffffff',
            'text-halo-width': 3.5,
            'text-halo-blur': 0.3,
          },
          filter: ['all', ['==', '$type', 'LineString']],
        },
      },
    };
  }
}
