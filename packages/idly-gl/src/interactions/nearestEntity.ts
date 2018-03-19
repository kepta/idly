import { Feature } from '@turf/helpers';
import { OsmGeometry } from 'idly-common/lib/osm/structures';
import { IDLY_NS } from '../constants';
import { InteractiveGlElement } from '../helpers/InteractiveGlElement';
import { makeNearestEntity$ } from '../streams';

export interface Props {
  hoverEntityId?: string;
  feature?: Feature<any>;
}
export class NearestEntity extends InteractiveGlElement<Props, {}> {
  protected glInstance: any;
  protected state = {};

  private onHoverEntity: (id?: string) => void;

  constructor(
    props: Props,
    gl: any,
    onHoverEntity: (id?: string) => void,
    beforeLayer?: string
  ) {
    super(props, 'hover-layer', beforeLayer);
    this.glInstance = gl;
    this.onHoverEntity = onHoverEntity;

    makeNearestEntity$(gl).forEach(this.handleStream);
  }

  protected handleStream = (f: any) => {
    const id = f && f.properties.id;

    this.onHoverEntity(id);
  };

  protected shouldComponentUpdate(nextProps: Props) {
    return nextProps.hoverEntityId !== this.props.hoverEntityId;
  }

  protected render() {
    const feature = this.props.feature;
    if (!feature || !feature.properties) {
      return null;
    }
    console.log('render');
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
            coordinates: coord,
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
              'line-color': '#fbb03b',
              'line-width': 22,
            },
          },
        },
      };
    }
  }
}
