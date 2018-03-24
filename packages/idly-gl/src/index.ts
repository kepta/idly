import { Map as GlMap } from 'mapbox-gl/dist/mapbox-gl';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { BASE_SOURCE } from './configuration';
import { addSource } from './helpers/helper';
import { LayerOpacity } from './helpers/layerOpacity';
import layers from './layers';
import { UI } from './ui';
import { Actions } from './ui/Actions';
import { MainTabs, State } from './ui/State';

export class IdlyGlPlugin {
  public Plugin?: UI;

  private config: Partial<State>;
  private container!: Element;
  private store!: BehaviorSubject<State>;
  private subscription!: Subscription;
  private actions!: Actions;
  private umounted = false;
  constructor(config: Partial<State>) {
    this.config = config;
    const l = layers.map(r => addSource(r.layer, BASE_SOURCE));

    const starter: State = {
      mainTab: {
        active: MainTabs.Tags,
      },
      tags: {},
      selectEntity: { selectedId: '', beforeLayer: l[0].id },
      map: {
        quadkeys: [],
        layers: l,
        loading: false,
        layerOpacity: LayerOpacity.High,
      },
      ...this.config,
    };
    this.store = new BehaviorSubject<State>(starter);
  }

  public onAdd(m: GlMap) {
    // @ts-ignore
    this.container = document.createElement('div');

    if (m.loaded()) {
      this.init(m);
    } else {
      m.on('load', () => this.init(m));
    }

    return this.container;
  }

  public onRemove(m: GlMap) {
    if (this.umounted) {
      return;
    }
    const div = this.container && this.container.parentNode;
    if (div) {
      div.removeChild(this.container);
    }
    if (this.Plugin) {
      this.Plugin.componentWillUnMount();
    }
    this.store.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.Plugin = undefined;
    this.umounted = true;
  }

  private init(m: any) {
    this.actions = new Actions(this.store);

    const plugin = new UI(
      this.store.getValue(),
      this.actions,
      this.container,
      m
    );

    this.subscription = this.store.subscribe(val => {
      plugin.setProps(val);
    });

    this.Plugin = plugin;
  }
}
