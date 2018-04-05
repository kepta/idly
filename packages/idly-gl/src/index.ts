import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map as rxMap } from 'rxjs/operators/map';
import { Subscription } from 'rxjs/Subscription';
import { App } from './App';
import { findPlaceholderLayers } from './helpers/helpers';
import { LayerOpacity } from './helpers/layerOpacity';
import layers from './layers';
import { Actions } from './store/Actions';
import { MainTabs, Store } from './store/index';
import { mapStreams } from './store/map.streams';
import { selectEntityStream } from './store/selectEntity.stream';

export class IdlyGlPlugin {
  public Plugin?: App;

  private config: Partial<Store>;
  private container!: Element;
  private store!: BehaviorSubject<Store>;
  private storeSubscription!: Subscription;
  private mapStreams!: () => void;
  private selectEntityStream!: () => void;
  private actions!: Actions;
  private mounted?: boolean = undefined;

  constructor(config: Partial<Store> = {}) {
    this.config = config;

    const starter: Store = {
      ...this.config,
      mainTab: {
        active: MainTabs.Info,
        ...this.config.mainTab,
      },
      tags: {
        ...this.config.tags,
      },
      selectEntity: {
        selectedId: '',
        beforeLayers: findPlaceholderLayers(layers),
        ...this.config.selectEntity,
      },
      map: {
        quadkeys: [],
        layers,
        loading: false,
        layerOpacity: LayerOpacity.High,
        featureCollection: {
          type: 'FeatureCollection',
          features: [],
        },
        ...this.config.map,
      },
    };

    this.store = new BehaviorSubject<Store>(starter);
  }

  public onAdd(m: any) {
    // @ts-ignore
    this.container = document.createElement('div');

    if (m.loaded()) {
      this.init(m);
    } else {
      m.on('load', () => this.init(m));
    }

    return this.container;
  }

  public onRemove() {
    if (this.mounted !== true) {
      return;
    }
    const div = this.container && this.container.parentNode;
    if (div) {
      div.removeChild(this.container);
    }
    if (this.Plugin) {
      this.Plugin.componentWillUnMount();
    }
    this.mapStreams();
    this.selectEntityStream();
    this.store.complete();
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
    this.Plugin = undefined;
    this.mounted = false;
  }

  private init(m: any) {
    if (this.mounted !== undefined) {
      return;
    }

    this.actions = new Actions(this.store);

    const plugin = new App(
      this.store.getValue(),
      this.actions,
      this.container,
      m
    );

    this.storeSubscription = this.store.subscribe(val => {
      plugin.setProps(val);
    });

    this.mapStreams = mapStreams(
      this.store.pipe(rxMap(({ map }) => map), distinctUntilChanged()),
      this.actions,
      m
    );

    this.selectEntityStream = selectEntityStream(
      this.store.pipe(
        rxMap(({ selectEntity }) => selectEntity),
        distinctUntilChanged()
      ),
      this.actions
    );

    this.Plugin = plugin;

    this.mounted = true;
  }
}
