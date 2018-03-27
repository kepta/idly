import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';
import { Component } from '../helpers/Component';
import { Store } from '../store/index';
import { fcLookup } from '../store/worker.derived';
import { Highlight } from './Highlight';
import { Hover } from './Hover';
import { Osm } from './Osm';
import { Select } from './Select';
import { UnloadedTiles } from './UnloadedTiles';

export interface Props {
  quadkeys: Store['map']['quadkeys'];
  fc: Store['map']['featureCollection'];
  layers: Store['map']['layers'];
  selectedEntityId?: string;
  hoverEntityId?: string;
}

export class MapComp extends Component<Props, {}> {
  protected children: {
    readonly selectComp: Select;
    readonly hoverComp: Hover;
    readonly highlightComp: Highlight;
    readonly osm: Osm;
    readonly unloadedTiles: UnloadedTiles;
  };

  constructor(
    props: Props,
    gl: any,
    beforeLayer: Store['selectEntity']['beforeLayers']
  ) {
    super(props, {});

    this.children = {
      highlightComp: new Highlight({}, gl, beforeLayer.middle),
      selectComp: new Select({}, gl, beforeLayer.top),
      hoverComp: new Hover({}, gl, beforeLayer.top),
      unloadedTiles: new UnloadedTiles({ quadkeys: props.quadkeys }, gl),
      osm: new Osm({ layers: props.layers, featureCollection: props.fc }, gl),
    };

    this.mount();
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

    if (id.charAt(0) !== 'r') {
      const feature = featureLookup && featureLookup.get(id);
      if (!feature) {
        return [];
      }
      return [feature];
    }

    return this.props.fc.features.filter(
      r => r.properties && r.properties.id === id
    );
  }

  protected render(props: Props) {
    const hoverFeature =
      props.selectedEntityId === props.hoverEntityId
        ? undefined
        : this.getFeature(props.hoverEntityId);

    const selectedFeature = this.getFeature(props.selectedEntityId);

    this.children.highlightComp.setProps({
      features: props.selectedEntityId ? selectedFeature : hoverFeature,
    });

    this.children.hoverComp.setProps({
      features: hoverFeature,
    });

    this.children.unloadedTiles.setProps({
      quadkeys: props.quadkeys,
    });

    this.children.selectComp.setProps({
      features: selectedFeature,
    });

    this.children.osm.setProps({
      featureCollection: props.fc,
      layers: props.layers,
    });
  }
}
