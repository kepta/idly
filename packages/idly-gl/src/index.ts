import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map as rxMap } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';

import { App } from './App';
import { findPlaceholderLayers } from './helpers/helpers';
import { LayerOpacity } from './helpers/layerOpacity';
import layers from './layers';
import { Actions } from './store/Actions';
import { MainTabs, Store } from './store/index';
import { mapStreams } from './store/map.streams';
import { selectEntityStream } from './store/selectEntity.stream';

// prevents running one or more of this plugin
let runningInstance: IdlyGlPlugin | undefined;

export class IdlyGlPlugin {
  private config: Partial<Store>;
  private container!: Element;
  private store!: BehaviorSubject<Store>;
  private destroy: Subject<void> = new Subject<void>();

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
        zoom: 17,
        ...this.config.map,
      },
    };

    this.store = new BehaviorSubject<Store>(starter);
  }

  public onAdd(m: any) {
    if (runningInstance) {
      throw new Error(
        'Idly-gl is already added, please use map.removeControl.'
      );
    }

    this.container = document.createElement('div');

    let inited = false;
    const init = () => {
      if (!inited) {
        this.init(m);
        inited = true;
      }
    };

    if (m.loaded()) {
      init();
    } else {
      m.on('load', init);
    }
    runningInstance = this;
    return this.container;
  }

  public onRemove() {
    if (this.destroy.closed) {
      return;
    }
    const div = this.container && this.container.parentNode;
    if (div) {
      div.removeChild(this.container);
    }
    runningInstance = undefined;
    this.store.complete();
    this.destroy.next();
    this.destroy.complete();
  }

  private init(m: any) {
    const actions = new Actions(this.store);
    const plugin = new App(this.store.getValue(), actions, this.container, m);

    this.store.subscribe(
      val => {
        plugin.setProps(val);
      },
      err => console.error(err),
      () => {
        plugin.componentWillUnMount();
      }
    );

    mapStreams(
      this.store.pipe(rxMap(({ map }) => map), distinctUntilChanged()),
      this.destroy,
      actions,
      m
    );

    selectEntityStream(
      this.store.pipe(
        rxMap(({ selectEntity }) => selectEntity),
        distinctUntilChanged()
      ),
      actions
    );
  }
}
