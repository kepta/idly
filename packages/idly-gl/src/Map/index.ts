import { EntityType, Relation } from 'idly-common/lib/osm/structures';
import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';
import { Component } from '../helpers/Component';
import { Store } from '../store/index';
import { fcLookup } from '../store/map.derived';
import { workerOperations } from '../worker';
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
    readonly highlightHoverComp: Highlight;
    readonly highlightSelectComp: Highlight;
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
      highlightSelectComp: new Highlight({}, gl, beforeLayer.last, 'select'),
      highlightHoverComp: new Highlight({}, gl, beforeLayer.last, 'hover'),
      selectComp: new Select({}, gl, beforeLayer.top),
      hoverComp: new Hover({}, gl, beforeLayer.middle),
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

  protected render(props: Props) {
    const hoverFeature =
      props.selectedEntityId === props.hoverEntityId
        ? undefined
        : this.getFeature(props.hoverEntityId);

    const selectedFeature = this.getFeature(props.selectedEntityId);

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
