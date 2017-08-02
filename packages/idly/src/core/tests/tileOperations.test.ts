import { Map, Set } from 'immutable';

import { mergeIds, removeExisting } from 'core/tileOperations';
import { nodeFactory } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';
import { tagsFactory } from 'osm/entities/helpers/tags';
const n1 = nodeFactory({ id: 'n-1' });
const n11 = nodeFactory({
  id: 'n-1',
  loc: genLngLat({ lon: 15, lat: 10 }),
  tags: tagsFactory({ k: 'k' })
});

const n2 = nodeFactory({ id: 'n-2' });
const n3 = nodeFactory({ id: 'n-3', loc: genLngLat({ lon: 5, lat: 10 }) });
const n4 = nodeFactory({ id: 'n-4', loc: genLngLat({ lon: 5, lat: 10 }) });

describe('tileSanitizer ', () => {
  it('should not add existing entities', () => {
    let result = removeExisting(Set(['n-1', 'n-2']), [n1, n3]);
    expect(result).toEqual([n3]);

    result = removeExisting(Set([]), [n1, n3]);
    expect(result).toEqual([n1, n3]);

    result = removeExisting(Set(['n-1', 'n-2']), []);
    expect(result).toEqual([]);

    result = removeExisting(Set(['n-1']), [n2]);
    expect(result).toEqual([n2]);
  });
});

describe('mergeIds', () => {
  it('should mergeIds', () => {
    const result = mergeIds(Set(['n-1', 'n-2']), [n3]);
    expect(result.equals(Set(['n-1', 'n-2', 'n-3']))).toEqual(true);
  });
});
