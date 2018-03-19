import { Map as GlMap } from 'mapbox-gl/dist/mapbox-gl';
import { BASE_SOURCE } from './configuration';
import { addSource } from './helpers/helper';
import layers from './layers';
import { UI } from './ui';
import { MainTabs } from './ui/State';

export class IdlyGlPlugin {
  public Plugin!: UI;

  private container!: Element;

  public onAdd(m: GlMap) {
    // @ts-ignore
    window.map = m;

    if (m.loaded()) {
      this.init(m);
    } else {
      m.on('load', () => this.init(m));
    }

    this.container = document.createElement('div');

    return this.container;
  }

  private init(m: any) {
    const l = layers.map(r => addSource(r.layer, BASE_SOURCE));
    this.Plugin = new UI({
      state: {
        mainTab: {
          active: MainTabs.Tags,
        },
        tags: {},
        selectEntity: { selectedId: '', beforeLayer: l[0].id },
        domContainer: this.container,
        gl: m,
        map: {
          quadkeysData: [],
          layers: l,
        },
      },
    });
  }
}
