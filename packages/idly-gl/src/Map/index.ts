import { EntityType } from 'idly-common/lib/osm/structures';
import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';
import { render } from 'lit-html/lib/lit-extended';
import { Popup } from 'mapbox-gl';
import { Component } from '../helpers/Component';
import { Actions } from '../store/Actions';
import { Store } from '../store/index';
import { fcLookup } from '../store/map.derived';
import { SelectorPopup } from '../ui/SelectorPopup';
import { workerOperations } from '../worker';
import { Highlight } from './Highlight';
import { Hover } from './Hover';
import { Osm } from './Osm';
import { Select } from './Select';
import { UnloadedTiles } from './UnloadedTiles';

export interface Props {
  quadkeys: Store['map']['quadkeys'];
  popup: Store['selectEntity']['popup'];
  mapBeforeLayer: Store['map']['beforeLayer'];
  fc: Store['map']['featureCollection'];
  layers: Store['map']['layers'];
  selectedEntityId?: string;
  hoverEntityId?: string;
  actions: Actions;
}

export class MapComp extends Component<Props, {}> {
  protected children: {
    readonly selectComp: Select;
    readonly hoverComp: Hover;
    readonly highlightHoverComp: Highlight;
    readonly highlightSelectComp: Highlight;
    readonly osm: Osm;
    readonly unloadedTiles: UnloadedTiles;
  };
  private gl: any;
  private popup?: any;

  constructor(
    props: Props,
    gl: any,
    selectBeforeLayer: Store['selectEntity']['beforeLayers']
  ) {
    super(props, {});
    this.gl = gl;
    this.children = {
      highlightSelectComp: new Highlight(
        {},
        gl,
        selectBeforeLayer.last,
        'select'
      ),
      highlightHoverComp: new Highlight(
        {},
        gl,
        selectBeforeLayer.last,
        'hover'
      ),
      selectComp: new Select({}, gl, selectBeforeLayer.top),
      hoverComp: new Hover({}, gl, selectBeforeLayer.middle),
      unloadedTiles: new UnloadedTiles({ quadkeys: props.quadkeys }, gl),
      osm: new Osm(
        { layers: props.layers, featureCollection: props.fc },
        gl,
        props.mapBeforeLayer
      ),
    };

    this.mount();

    this.putPopup();
  }

  public componentWillUnMount() {
    super.componentWillUnMount();
    if (this.popup) {
      this.popup.remove();
      this.popup = undefined;
    }
  }

  protected getFeature(
    id?: string
  ):
    | GetQuadkey['response']['features']
    | Promise<GetQuadkey['response']['features']> {
    if (!id || !this.props.fc) {
      return [];
    }

    const featureLookup = this.props.fc && fcLookup(this.props.fc);

    const feature = featureLookup && featureLookup.get(id);

    if (id.charAt(0) !== 'r') {
      if (!feature) {
        return [];
      }
      return feature;
    }

    if (feature && feature.length > 0) {
      return feature;
    }

    return workerOperations.getEntity({ id }).then(r => {
      if (r && r.type === EntityType.RELATION && featureLookup) {
        return r.members
          .reduce(
            (prev: Store['map']['featureCollection']['features'], member) => {
              const features = featureLookup.get(member.id);
              if (features) {
                prev.push(...features);
              }
              return prev;
            },
            []
          )
          .filter(
            f => f && f.geometry
          ) as Store['map']['featureCollection']['features'];
      }
      return [];
    });
  }

  protected putPopup() {
    if (this.popup) {
      this.popup.remove();
      this.popup = undefined;
    }

    if (!this.props.popup) {
      return;
    }
    const latlong = [this.props.popup.lnglat.lng, this.props.popup.lnglat.lat];
    const el = document.createElement('div');
    el.classList.add('idly-gl');
    render(SelectorPopup(this.props.popup.ids, this.props.actions), el);
    this.popup = new Popup()
      .setLngLat(latlong)
      .setDOMContent(el)
      .addTo(this.gl);
  }

  protected render(props: Props) {
    const hoverFeature =
      props.selectedEntityId === props.hoverEntityId
        ? undefined
        : this.getFeature(props.hoverEntityId);

    const selectedFeature = this.getFeature(props.selectedEntityId);
    this.putPopup();
    this.children.hoverComp.setProps({
      features: hoverFeature,
    });

    this.children.selectComp.setProps({
      features: selectedFeature,
    });

    this.children.unloadedTiles.setProps({
      quadkeys: props.quadkeys,
    });

    this.children.highlightHoverComp.setProps({
      features: hoverFeature,
    });

    this.children.highlightSelectComp.setProps({
      features: selectedFeature,
    });

    this.children.osm.setProps({
      featureCollection: props.fc,
      layers: props.layers,
    });
  }
}
