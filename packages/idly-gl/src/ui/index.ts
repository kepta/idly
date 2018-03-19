import { render } from 'lit-html/lib/lit-extended';
import { Component } from '../helpers/Component';
import { MapComp } from './Map';
import { State } from './State';
import { Ui } from './ui';

export class UI extends Component<any, State, void> {
  public state: State;

  private mapComp: MapComp;

  constructor(props: { state: State }) {
    super(props);
    this.state = props.state;

    this.mapComp = new MapComp(
      {
        hoverEntityId: this.state.selectEntity.hoverId,
        selectedEntityId: this.state.selectEntity.selectedId,
        quadkeys: this.state.map.quadkeysData,
      },
      this.state.gl,
      this.state.map.layers,
      this.changeQuadkeysData,
      this.selectEntityId,
      this.hoverEntityId,
      this.state.selectEntity.beforeLayer
    );
    this.render();
  }

  public componentWillUnMount() {
    return this.mapComp.componentWillUnMount();
  }

  public render() {
    window.setate = this.state;
    this.mapComp.setProps({
      hoverEntityId: this.state.selectEntity.hoverId,
      selectedEntityId: this.state.selectEntity.selectedId,
      quadkeys: this.state.map.quadkeysData,
    });

    render(
      Ui({
        changeMainTab: this.changeMainTab,
        selectEntity: this.state.selectEntity,
        mainTab: this.state.mainTab,
      }),
      this.state.domContainer
    );
  }

  public selectEntityId = () => {
    const hoverId = this.state.selectEntity.hoverId;
    this.setState({
      selectEntity: {
        ...this.state.selectEntity,
        selectedId: hoverId,
      },
    });
  };

  public hoverEntityId = (id?: string) => {
    this.setState({
      selectEntity: { ...this.state.selectEntity, hoverId: id },
    });
  };

  protected shouldComponentUpdate() {
    return true;
  }

  private changeMainTab = (tab: any) => {
    this.setState({ mainTab: { ...this.state.mainTab, active: tab } });
  };

  private changeQuadkeysData = (d: State['map']['quadkeysData']) => {
    this.setState({ map: { ...this.state.map, quadkeysData: d } });
  };
}
