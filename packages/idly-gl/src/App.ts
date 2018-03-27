import { render } from 'lit-html/lib/lit-extended';
import { Component } from './helpers/Component';
import { MapComp } from './Map';
import { Actions } from './store/Actions';
import { Store } from './store/index';
import { Ui } from './ui/ui';

export class App extends Component<Store, {}, any, void> {
  protected children: {
    mapComp: MapComp;
  };

  private actions: Actions;
  private dom: Element;

  constructor(props: Store, actions: Actions, dom: Element, glInstance: any) {
    super(props, {});
    this.actions = actions;
    this.dom = dom;

    this.children = {
      mapComp: new MapComp(
        {
          hoverEntityId: props.selectEntity.hoverId,
          selectedEntityId: props.selectEntity.selectedId,
          quadkeys: props.map.quadkeys,
          fc: props.map.featureCollection,
          layers: props.map.layers,
        },
        glInstance,
        props.selectEntity.beforeLayers
      ),
    };

    this.mount();
  }

  protected render(props: Store) {
    (window as any).render = props;

    this.children.mapComp.setProps({
      hoverEntityId: props.selectEntity.hoverId,
      selectedEntityId: props.selectEntity.selectedId,
      quadkeys: props.map.quadkeys,
      fc: props.map.featureCollection,
      layers: props.map.layers,
    });

    render(
      Ui({
        loading: props.map.loading,
        selectEntity: props.selectEntity,
        mainTab: props.mainTab,
        layerOpacity: props.map.layerOpacity,
        layers: props.map.layers,
        actions: this.actions,
      }),
      this.dom
    );
  }
}
