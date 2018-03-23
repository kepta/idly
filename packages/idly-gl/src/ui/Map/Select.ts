import { OsmGeometry } from 'idly-common/lib/osm/structures';
import { IDLY_NS } from '../../constants';
import { ComponentUpdateType } from '../../helpers/CompX';
import { GlComp } from '../../helpers/GlComp';

export interface Props {
  feature?: { id?: any; properties: any; geometry: any };
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
    return prev.props.feature !== next.props.feature;
  }

  protected render(props: Props) {
    const { feature } = props;

    if (!feature || !feature.properties) {
      return null;
    }

    const geometry = feature.properties[`${IDLY_NS}geometry`];
    const coord = feature.geometry.coordinates;

    if (geometry === OsmGeometry.POINT) {
      return {
        source: {
          type: 'geojson',
          data: {
            type: 'Point',
            coordinates: coord,
          },
        },
        layers: {
          magical: {
            type: 'circle',
            paint: {
              'circle-radius': 16,
              'circle-color': '#00f9ff',
            },
          },
        },
      };
    } else if (geometry === OsmGeometry.AREA) {
      return {
        source: {
          type: 'geojson',
          data: {
            type: 'Polygon',
            coordinates: coord,
          },
        },
        layers: {
          fill: {
            type: 'fill',
            paint: {
              'fill-color': '#00f9ff',
              'fill-outline-color': '#00f9ff',
              'fill-opacity': 0.1,
            },
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
          },
        },
      };
    } else if (geometry === OsmGeometry.LINE) {
      return {
        source: {
          type: 'geojson',
          data: {
            type: 'LineString',
            coordinates: coord,
          },
        },
        layers: {
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
          },
        },
      };
    }
    return;
  }
}
