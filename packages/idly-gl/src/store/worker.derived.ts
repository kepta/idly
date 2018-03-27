import { weakCache } from 'idly-common/lib/misc';
import { GetQuadkey } from 'idly-worker/lib/operations/getQuadkey/type';

export const fcLookup: (
  fc: GetQuadkey['response']
) => Map<string, GetQuadkey['response']['features'][0]> = weakCache(fc =>
  fc.features.reduce((pre: Map<string, any>, cur: any) => {
    if (cur.properties) {
      pre.set(cur.properties.id, cur);
    }
    return pre;
  }, new Map())
);
