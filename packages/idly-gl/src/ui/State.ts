import { weakCache } from 'idly-common/lib/misc';
import { quadkeyToTile } from 'idly-common/lib/misc/quadkeyToTile';
import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { fetchTileXml } from '../helpers/helper';
import { LayerOpacity } from '../helpers/layerOpacity';

export const enum MainTabs {
  Tags = 'Tags',
  Relations = 'Relations',
  Layers = 'Layers',
}

export interface State {
  mainTab: {
    active: MainTabs;
  };
  tags: {};
  selectEntity: {
    hoverId?: string;
    selectedId?: string;
    beforeLayers: { top: string; middle: string; last: string };
  };
  map: {
    loading: boolean;
    layers: any[]; // the gl layers
    quadkeys: string[]; // quadkeys in view
    featureCollection?: GetQuadkey['response'];
    beforeLayer?: string;
    layerOpacity: LayerOpacity;
  };
}

export class DerivedStore {
  private store$: BehaviorSubject<State>;

  constructor(store: BehaviorSubject<State>) {
    this.store$ = store;
  }

  get quadkeysAndEntities() {
    return derivedQuadkeysToEntities(this.store$.getValue().map.quadkeys);
  }

  get fcLookup(): Map<string, GetQuadkey['response']['features'][0]> {
    const fc = this.store$.getValue().map.featureCollection;
    if (!fc) {
      return new Map();
    }
    return derivedFcLookup(fc);
  }

  get visibleLayers() {
    return derivedVisibleLayers(this.store$.getValue().map.layers);
  }
}

const derivedQuadkeysToEntities = weakCache((quadkeys: string[]) => {
  return Promise.all(
    quadkeys.map(quadkeyToTile).map((t, index) =>
      fetchTileXml(t.x, t.y, t.z).then(r => ({
        quadkey: quadkeys[index],
        entities: r,
      }))
    )
  );
});

const derivedFcLookup: (
  fc: GetQuadkey['response']
) => Map<string, GetQuadkey['response']['features'][0]> = weakCache(fc =>
  fc.features.reduce((pre: Map<string, any>, cur: any) => {
    if (cur.properties) {
      pre.set(cur.properties.id, cur);
    }
    return pre;
  }, new Map())
);

const derivedVisibleLayers = weakCache((layers: any[]) =>
  layers.filter(r => !r.hide)
);
