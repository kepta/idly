import { FeatureCollection } from '@turf/helpers';
import { Component } from '../helpers/Component';
import { NearestEntity } from '../interactions/nearestEntity';
import { Osm } from './Osm';
import { OsmGeoJSON } from './Osm/OsmGeoJSON';
import { SelectEntity } from './selectedEntity';
import { State } from './State';

export interface Props {
  quadkeys?: State['map']['quadkeysData'];
  selectedEntityId?: string;
  hoverEntityId?: string;
}

export type FC = FeatureCollection<
  any,
  {
    [index: string]: any;
  }
>;

export interface MapState {
  fc?: FC;
}

export class MapComp extends Component<Props, MapState, void> {
  protected state = {
    fc: undefined,
  };

  private selectEntity: SelectEntity;
  private hoverComp: NearestEntity;
  private osmGeoJSON: OsmGeoJSON;
  private osm: Osm;

  private featureLookup = new Map();

  constructor(
    props: Props,
    gl: any,
    layers: any[],
    changeQuadkeys: (d: State['map']['quadkeysData']) => void,
    selectEntityId: (id?: string) => void,
    hoverEntityId: (id?: string) => void,
    beforeLayer?: string
  ) {
    super(props);

    this.selectEntity = new SelectEntity(
      {
        id: props.selectedEntityId,
      },
      gl,
      selectEntityId,
      beforeLayer
    );

    this.hoverComp = new NearestEntity(
      {
        hoverEntityId: props.hoverEntityId,
      },
      gl,
      hoverEntityId,
      beforeLayer
    );

    this.osm = new Osm({}, gl, layers, changeQuadkeys);
    this.osmGeoJSON = new OsmGeoJSON(
      { quadkeys: props.quadkeys },
      this.setOsmData
    );
  }

  public componentWillUnMount() {
    this.selectEntity.componentWillUnMount();
    this.hoverComp.componentWillUnMount();
    this.osm.componentWillUnMount();
  }

  protected render() {
    this.selectEntity.setProps({
      id: this.props.selectedEntityId,
      feature: this.featureLookup.get(this.props.selectedEntityId),
    });
    this.hoverComp.setProps({
      hoverEntityId:
        this.props.selectedEntityId === this.props.hoverEntityId
          ? undefined
          : this.props.hoverEntityId,
      feature:
        this.props.selectedEntityId === this.props.hoverEntityId
          ? undefined
          : this.featureLookup.get(this.props.hoverEntityId),
    });
    this.osm.setProps({ featureCollection: this.state.fc });
    this.osmGeoJSON.setProps({ quadkeys: this.props.quadkeys });
  }

  protected shouldComponentUpdate(nextProps: Props, nextState: MapState) {
    return true;
  }

  private setOsmData = (fc: FC) => {
    if (fc && fc.features) {
      this.featureLookup = fc.features.reduce(
        (pre: Map<string, any>, cur: any) => pre.set(cur.properties.id, cur),
        new Map()
      );
    }
    this.setState({ fc });
  };
}
