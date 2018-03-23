import { Map as GlMap } from 'mapbox-gl/dist/mapbox-gl';
import { BASE_SOURCE } from './configuration';
import { addSource } from './helpers/helper';
import layers from './layers';
import { UI } from './ui';
import { MainTabs, State } from './ui/State';
import { LayerOpacity } from './helpers/layerOpacity';

export class IdlyGlPlugin {
  public Plugin?: UI;

  private container!: Element;
  private config: Partial<State>;

  constructor(config: Partial<State>) {
    this.config = config;
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
    const div = this.container && this.container.parentNode;
    if (div) {
      div.removeChild(this.container);
    }
    if (this.Plugin) {
      this.Plugin.componentWillUnMount();
    }
    this.Plugin = undefined;
  }

  private init(m: any) {
    const l = layers.map(r => addSource(r.layer, BASE_SOURCE));
    this.Plugin = new UI(
      {
        config: {
          mainTab: {
            active: MainTabs.Tags,
          },
          tags: {},
          selectEntity: { selectedId: '', beforeLayer: l[0].id },
          domContainer: this.container,
          gl: m,
          map: {
            quadkeys: [],
            layers: l,
            loading: false,
            layerOpacity: LayerOpacity.High,
          },
          ...this.config,
        },
      },
      m
    );
  }
}
