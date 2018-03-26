import { weakCache } from 'idly-common/lib/misc';
import { quadkeyToTile } from 'idly-common/lib/misc/quadkeyToTile';
import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';
import { fetchTileXml } from '../helpers/helper';
import { workerOperations } from '../worker';

export const derivedQuadkeysToEntities = weakCache((quadkeys: string[]) => {
  return Promise.all(
    quadkeys.map(quadkeyToTile).map((t, index) =>
      fetchTileXml(t.x, t.y, t.z).then(r => ({
        quadkey: quadkeys[index],
        entities: r,
      }))
    )
  );
});

export const derivedQuadkeyToFC: (
  quadkeys: string[]
) => Promise<GetQuadkey['response']> = (quadkeys: string[]) => {
  return derivedQuadkeysToEntities(quadkeys).then(workerOperations.getQuadkey);
};

export const derivedFcLookup: (
  fc: GetQuadkey['response']
) => Map<string, GetQuadkey['response']['features'][0]> = weakCache(fc =>
  fc.features.reduce((pre: Map<string, any>, cur: any) => {
    if (cur.properties) {
      pre.set(cur.properties.id, cur);
    }
    return pre;
  }, new Map())
);

export const derivedVisibleLayers = weakCache((layers: any[]) =>
  layers.filter(r => !r.hide)
);
