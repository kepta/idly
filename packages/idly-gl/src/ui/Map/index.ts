import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';
import { derivedFcLookup } from '../../derived';
import { Component } from '../../helpers/Component';
import { workerOperations } from '../../worker';
import { State } from '../State';
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
    readonly osm: Osm;
    readonly unloadedTiles: UnloadedTiles;
  };

  constructor(props: Props, gl: any, beforeLayer?: string) {
    super(props, {});

    this.children = {
      selectComp: new Select({}, gl, beforeLayer),
      hoverComp: new Hover({}, gl, beforeLayer),
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
    if (!id) {
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

    return workerOperations.getEntity({ id }).then(r => {
      if (r && featureLookup) {
        return r.members
          .map(e => featureLookup.get(e.id))
          .filter(r => r && r.geometry);
      }
    });
  }

  protected render(props: Props) {
    const hoverFeature = this.getFeature(props.hoverEntityId);

    this.children.hoverComp.setProps({
      features:
        props.selectedEntityId === props.hoverEntityId
          ? undefined
          : hoverFeature,
    });

    this.children.unloadedTiles.setProps({
      quadkeys: props.quadkeys,
    });

    this.children.selectComp.setProps({
      features: this.getFeature(props.selectedEntityId),
    });

    this.children.osm.setProps({
      featureCollection: props.fc,
      layers: props.layers,
    });
  }
}
