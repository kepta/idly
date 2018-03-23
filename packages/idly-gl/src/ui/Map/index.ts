import { derivedFcLookup } from '../../derived';
import { Component } from '../../helpers/CompX';
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

  protected render(props: Props) {
    const featureLookup = props.fc && derivedFcLookup(props.fc);
    const hoverEntityId = props.hoverEntityId || '';
    const selectedEntityId = props.selectedEntityId || '';
    const hoverFeature = featureLookup && featureLookup.get(hoverEntityId);

    this.children.hoverComp.setProps({
      feature:
        props.selectedEntityId === props.hoverEntityId
          ? undefined
          : hoverFeature,
    });

    this.children.unloadedTiles.setProps({
      quadkeys: props.quadkeys,
    });

    this.children.selectComp.setProps({
      feature: featureLookup && featureLookup.get(selectedEntityId),
    });

    this.children.osm.setProps({
      featureCollection: props.fc,
      layers: props.layers,
    });
  }
}
