import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map as rxMap } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';

import { Entity } from 'idly-common/lib/osm/structures';
import { App } from './App';
import { findPlaceholderLayers } from './helpers/helpers';
import { LayerOpacity } from './helpers/layerOpacity';
import layers from './layers';
import { Actions } from './store/Actions';
import { MainTabs, Store } from './store/index';
import { mapStreams } from './store/map.streams';
import { selectEntityStream } from './store/selectEntity.stream';
import { pollGlReady } from './streams';
import { workerOperations } from './worker';

// prevents running one or more of this plugin
let runningInstance: IdlyGlPlugin | undefined;

export class IdlyGlPlugin {
  private config: Partial<Store>;
  private container!: Element;
  private store!: BehaviorSubject<Store>;
  private destroy: Subject<void> = new Subject<void>();
  private onChangeCb?: (store: Store) => void;
  constructor(config: Partial<Store> = {}) {
    this.config = config;

    const starter: Store = {
      ...this.config,
      tab: {
        active: MainTabs.Info,
        ...this.config.tab,
      },

      interaction: {
        selectedId: '',
        beforeLayers: findPlaceholderLayers(layers),
        ...this.config.interaction,
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

    /**
     * There seems to be no reliable way of getting
     * the map ready state after map.on('load') event
     * has fired.
     */
    pollGlReady(m, this.destroy).subscribe(() => {
      init();
    });

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

  public onChange = (cb: ((store: Store) => void) | undefined) => {
    if (cb) {
      this.onChangeCb = cb;
    }
  };

  public getStore = (): Store => {
    return Object.assign({}, this.store.getValue());
  };

  public updateStore = (inputStore: Partial<Store>) => {
    this.store.next(mergeStore(this.store.getValue(), inputStore));
  };

  public getEntity(id: string): Promise<Entity | undefined> {
    return workerOperations.getEntity({ id });
  }

  private init(m: any) {
    const actions = new Actions(this.store);
    const plugin = new App(this.store.getValue(), actions, this.container, m);

    this.store.subscribe(
      val => {
        plugin.setProps(val);
        if (this.onChangeCb) {
          this.onChangeCb({ ...val });
        }
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
        rxMap(({ interaction }) => interaction),
        distinctUntilChanged()
      ),
      actions
    );
  }
}

export default IdlyGlPlugin;

function mergeStore(previousStore: Store, store: Partial<Store> = {}): Store {
  return {
    ...previousStore,
    ...store,
    tab: {
      ...previousStore.tab,
      ...store.tab,
    },
    interaction: {
      ...previousStore.interaction,
      ...store.interaction,
    },
    map: {
      ...previousStore.map,
      ...store.map,
    },
  };
}
