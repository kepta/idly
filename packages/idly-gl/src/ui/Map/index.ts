import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';
import { derivedFcLookup } from '../../derived';
import { Component } from '../../helpers/Component';
import { workerOperations } from '../../worker';
import { State } from '../State';
import { Highlight } from './Highlight';
import { Hover } from './Hover';
import { Osm } from './Osm';
import { Select } from './Select';
import { UnloadedTiles } from './UnloadedTiles';

export interface Props {
  quadkeys: State['map']['quadkeys'];
  fc: State['map']['featureCollection'];
  layers: State['map']['layers'];
  selectedEntityId?: string;
  hoverEntityId?: string;
}

export class MapComp extends Component<Props, {}, any, any> {
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
    beforeLayer: State['selectEntity']['beforeLayers']
  ) {
    super(props, {});

    this.children = {
      highlightComp: new Highlight({}, gl, beforeLayer.middle),
      selectComp: new Select({}, gl, beforeLayer.top),
      hoverComp: new Hover({}, gl, beforeLayer.top),
      unloadedTiles: new UnloadedTiles({ quadkeys: props.quadkeys }, gl),
      osm: new Osm({ layers: props.layers }, gl),
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
    const featureLookup = this.props.fc && derivedFcLookup(this.props.fc);

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

    // hack to render these after highlight

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
