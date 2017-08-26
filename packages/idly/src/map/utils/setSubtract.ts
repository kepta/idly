import { Set } from 'immutable';

// import { Entity } from 'osm/entities/entities';

import { weakCache2 } from 'utils/weakCache';

export const setSubtract = <P>() =>
  weakCache2<Set<P>, Set<P>, Set<P>>(function(a: Set<P>, b: Set<P>): Set<P> {
    return a.subtract(b);
  });

export const setSubtractEntities = setSubtract<any>();
