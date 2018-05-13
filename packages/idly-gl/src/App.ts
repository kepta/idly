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
          hoverEntityId: props.interaction.hoverId,
          popup: props.interaction.popup,
          selectedEntityId: props.interaction.selectedId,
          quadkeys: props.map.quadkeys,
          fc: props.map.featureCollection,
          layers: props.map.layers,
          mapBeforeLayer: props.map.beforeLayer,
          actions: this.actions,
        },
        glInstance,
        props.interaction.beforeLayers
      ),
    };

    this.mount();
  }

  protected render(props: Store) {
    (window as any).render = props;
    this.children.mapComp.setProps({
      popup: props.interaction.popup,
      hoverEntityId: props.interaction.hoverId,
      selectedEntityId: props.interaction.selectedId,
      quadkeys: props.map.quadkeys,
      fc: props.map.featureCollection,
      layers: props.map.layers,
      mapBeforeLayer: props.map.beforeLayer,
      actions: this.actions,
    });

    render(
      Ui({
        loading: props.map.loading,
        selectEntity: props.interaction,
        mainTab: props.tab,
        layerOpacity: props.map.layerOpacity,
        layers: props.map.layers,
        actions: this.actions,
        entityTree: props.entityTree,
        zoom: props.map.zoom,
      }),
      this.dom
    );
  }
}
