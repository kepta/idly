import { render } from 'lit-html/lib/lit-extended';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/operators/switchMap';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { derivedQuadkeyToFC } from '../derived';
import { Component } from '../helpers/CompX';
import { layerOpacity, LayerOpacity } from '../helpers/layerOpacity';
import { makeClick$, makeNearestEntity$, moveEndBbox$ } from '../streams';
import { MapComp } from './Map/index';
import { State } from './State';
import { Ui } from './ui';

export class UI extends Component<{ config: State }, State, any, void> {
  protected children: {
    mapComp: MapComp;
  };

  private subjects = {
    mapFeatureCollection: new Subject<State['map']['quadkeys']>(),
  };

  private streams: Subscription[];

  constructor(props: { config: State }, glInstance: any) {
    super(props, props.config);

    this.children = {
      mapComp: new MapComp(
        {
          hoverEntityId: props.config.selectEntity.hoverId,
          selectedEntityId: props.config.selectEntity.selectedId,
          quadkeys: props.config.map.quadkeys,
          fc: props.config.map.featureCollection,
          layers: props.config.map.layers,
        },
        props.config.gl,
        props.config.selectEntity.beforeLayer
      ),
    };

    this.mount();

    // useful for updating the FC whenever quadkeys change
    // the reason its not derived property is because
    // if a user modifies an entity, we might need to
    // update the fc but not the quadkey.
    // the reason we dont pipe  modifyFc in this stream
    // is because if someone from outside changes the quadkeys
    // we might want to fetch fc for that. Putting it here
    // couples it to only fetch FC whenever map move ends.
    this.streams = [
      this.subjects.mapFeatureCollection
        .pipe(
          distinctUntilChanged(),
          switchMap(quadkeys => fromPromise(derivedQuadkeyToFC(quadkeys)))
        )
        .subscribe(r => this.modifyFC(r), e => console.error(e)),

      moveEndBbox$(glInstance).subscribe(
        r => this.modifyQuadkeys(r),
        e => console.error(e)
      ),

      makeNearestEntity$(
        glInstance,
        props.config.map.layers.map(l => l.id)
      ).subscribe(
        f => {
          this.modifyHoverId(f && f.properties.id);
        },
        e => console.error(e)
      ),

      makeClick$(glInstance).subscribe(this.modifySelectedId, e =>
        console.error(e)
      ),
    ];
  }

  public componentWillUnMount() {
    super.componentWillUnMount();

    this.streams.forEach(s => s.unsubscribe());

    const subs: Record<string, Subject<any>> = this.subjects;

    Object.keys(subs).forEach(s => subs[s].unsubscribe());
  }

  protected render(_: never, state: State) {
    this.children.mapComp.setProps({
      hoverEntityId: state.selectEntity.hoverId,
      selectedEntityId: state.selectEntity.selectedId,
      quadkeys: state.map.quadkeys,
      fc: state.map.featureCollection,
      layers: state.map.layers,
    });

    render(
      Ui({
        loading: state.map.loading,
        changeMainTab: this.modifyMainTab,
        modifyLayerOpacity: this.modifyLayerOpacity,
        selectEntity: state.selectEntity,
        mainTab: state.mainTab,
        layerOpacity: state.map.layerOpacity,
      }),
      state.domContainer
    );

    this.subjects.mapFeatureCollection.next(state.map.quadkeys);
  }

  // actions
  private modifySelectedId = () => {
    this.setState({
      selectEntity: {
        ...this.state.selectEntity,
        selectedId: this.state.selectEntity.hoverId,
      },
    });
  };

  private modifyHoverId = (id?: string) => {
    this.setState({
      selectEntity: { ...this.state.selectEntity, hoverId: id },
    });
  };

  private modifyMainTab = (mainTab: any) => {
    this.setState({ mainTab: { ...this.state.mainTab, active: mainTab } });
  };

  private modifyQuadkeys = (d: State['map']['quadkeys']) => {
    if (d.every(q => this.state.map.quadkeys.indexOf(q) > -1)) {
      return;
    }
    this.setState({ map: { ...this.state.map, quadkeys: d, loading: true } });
  };

  private modifyFC = (d: State['map']['featureCollection']) => {
    this.setState({
      map: { ...this.state.map, featureCollection: d, loading: false },
    });
  };
  private modifyLayerOpacity = () => {
    let next: LayerOpacity;
    const current = this.state.map.layerOpacity;

    if (current === LayerOpacity.High) {
      next = LayerOpacity.Medium;
    } else if (current === LayerOpacity.Medium) {
      next = LayerOpacity.Low;
    } else {
      next = LayerOpacity.High;
    }
    this.setState({
      map: {
        ...this.state.map,
        layerOpacity: next,
        layers: layerOpacity(
          next,
          this.state.map.layerOpacity,
          this.state.map.layers
        ),
      },
    });
  };
}
