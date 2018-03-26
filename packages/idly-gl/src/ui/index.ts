import { render } from 'lit-html/lib/lit-extended';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map as rxMap } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { derivedQuadkeyToFC, derivedVisibleLayers } from '../derived';
import { Component } from '../helpers/Component';
import { makeClick$, makeNearestEntity$, moveEndBbox$ } from '../streams';
import { Actions } from './Actions';
import { MapComp } from './Map/index';
import { DerivedStore, MainTabs, State } from './State';
import { Ui } from './ui';

export class UI extends Component<State, {}, any, void> {
  protected children: {
    mapComp: MapComp;
  };

  private subjects = {
    mapFeatureCollection: new Subject<State['map']['quadkeys']>(),
  };

  private streams: Subscription[];
  private actions: Actions;
  private dom: Element;
  private dStore: DerivedStore;

  constructor(props: State, actions: Actions, dom: Element, glInstance: any) {
    super(props, {});
    this.actions = actions;
    this.dom = dom;
    this.dStore = new DerivedStore(this.props$);

    this.children = {
      mapComp: new MapComp(
        {
          hoverEntityId: props.selectEntity.hoverId,
          selectedEntityId: props.selectEntity.selectedId,
          quadkeys: props.map.quadkeys,
          fc: props.map.featureCollection,
          layers: props.map.layers,
          dStore: this.dStore,
        },
        glInstance,
        props.selectEntity.beforeLayers
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
        .subscribe(r => this.actions.modifyFC(r), e => console.error(e)),

      moveEndBbox$(glInstance).subscribe(
        r => this.actions.modifyQuadkeys(r),
        e => console.error(e)
      ),

      makeNearestEntity$(
        glInstance,
        this.props$.pipe(
          rxMap(r => r.map.layers),
          distinctUntilChanged(),
          rxMap(l => {
            return derivedVisibleLayers(l).map(l => l.layer.id);
          })
        )
      ).subscribe(
        ids => {
          // prevent when multiple trs are presents and
          // the user is made to believe only one is there
          if (ids.length > 1 && ids.every(e => e.charAt(0) === 'r')) {
            this.actions.modifyMainTab(MainTabs.Relations);
            return;
          }
          this.actions.modifyHoverId(ids[0]);
        },
        e => console.error(e)
      ),

      makeClick$(glInstance).subscribe(
        () => this.actions.modifySelectedId(),
        e => console.error(e)
      ),
    ];
  }

  public componentWillUnMount() {
    super.componentWillUnMount();

    this.streams.forEach(s => s.unsubscribe());

    const subs: Record<string, Subject<any>> = this.subjects;

    Object.keys(subs).forEach(s => subs[s].unsubscribe());
  }

  protected render(props: State) {
    window.render = props;
    this.children.mapComp.setProps({
      hoverEntityId: props.selectEntity.hoverId,
      selectedEntityId: props.selectEntity.selectedId,
      quadkeys: props.map.quadkeys,
      fc: props.map.featureCollection,
      layers: props.map.layers,
      dStore: this.dStore,
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

    this.subjects.mapFeatureCollection.next(props.map.quadkeys);
  }
}
