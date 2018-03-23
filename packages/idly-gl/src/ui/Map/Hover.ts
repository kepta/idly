import { OsmGeometry } from 'idly-common/lib/osm/structures';
import { IDLY_NS } from '../../constants';
import { ComponentUpdateType } from '../../helpers/CompX';
import { GlComp } from '../../helpers/GlComp';

export interface Props {
  feature?: { id?: any; properties: any; geometry: any };
}
export class Hover extends GlComp<Props, {}, any, any> {
  constructor(props: Props, gl: any, beforeLayer?: string) {
    super(props, {}, gl, 'hover-layer', beforeLayer);
    this.mount();
  }

  protected shouldComponentUpdate({
    prev,
    next,
  }: ComponentUpdateType<Props, {}>) {
    return prev.props.feature !== next.props.feature;
  }

  protected render(props: Props) {
    const feature = props.feature;

    if (!feature || !feature.properties) {
      return null;
    }
    const geometry = feature.properties[`${IDLY_NS}geometry`];
    const coordinates = feature.geometry.coordinates;

    if (geometry === OsmGeometry.POINT) {
      return {
        source: {
          type: 'geojson',
          data: {
            type: 'Point',
            coordinates,
          },
        },
        layers: {
          magical: {
            type: 'circle',
            paint: {
              'circle-radius': 16,
              'circle-color': '#fbb03b',
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
            coordinates,
          },
        },
        layers: {
          fill: {
            type: 'fill',
            paint: {
              'fill-color': '#fbb03b',
              'fill-outline-color': '#fbb03b',
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
              'line-color': '#fbb03b',
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
            coordinates,
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
              'line-color': '#fbb03b',
              'line-width': 22,
            },
          },
        },
      };
    }
    return;
  }
}
