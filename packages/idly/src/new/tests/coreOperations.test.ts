import { Map, Set } from 'immutable';

import {
  addToModifiedEntities,
  addToVirginEntities,
  removeEntities
} from 'new/coreOperations';
import { nodeFactory } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';
import { tagsFactory } from 'osm/others/tags';

const n1 = nodeFactory({ id: 'n-1' });
const n11 = nodeFactory({
  id: 'n-1',
  loc: genLngLat({ lon: 15, lat: 10 }),
  tags: tagsFactory({ k: 'k' })
});

const n2 = nodeFactory({ id: 'n-2' });
const n22 = nodeFactory({ id: 'n-2', tags: tagsFactory({ k: 'k' }) });
const n3 = nodeFactory({ id: 'n-3', loc: genLngLat({ lon: 5, lat: 10 }) });
const n4 = nodeFactory({ id: 'n-4', loc: genLngLat({ lon: 5, lat: 10 }) });
describe('addToVirginEntities', () => {
  it('should add to empty virgin entities', () => {
    expect(addToVirginEntities(Set(), Set([n1, n2]), Set(), true)).toEqual(
      Set([n1, n2])
    );
  });
  it('should add to virign entities', () => {
    const result = addToVirginEntities(Set([n3]), Set([n1, n2]), Set(), true);
    const equality = result.equals(Set([n1, n2, n3]));
    expect(equality).toEqual(true);
  });
  it('should add to virign entities when modified entities.size > 0', () => {
    const result = addToVirginEntities(
      Set([n3]),
      Set([n1, n2]),
      Set([n4]),
      true
    );
    const equality = result.equals(Set([n1, n2, n3]));
    expect(equality).toEqual(true);
  });
  it('should throw error if id exists in virign entities already', () => {
    // const result = addEntities(Set([n3]), Set([n1, n2]), Set([n11]), true);
    // const equality = result.equals(Set([n1, n2, n3]));
    expect(() =>
      addToVirginEntities(Set([n11]), Set([n1, n2]), Set([n3]), true)
    ).toThrowError('intersection is not zero');
  });
  it('should throw error if id exists in modified entities already', () => {
    expect(() =>
      addToVirginEntities(Set([n3]), Set([n1, n2]), Set([n11]), true)
    ).toThrowError('intersection is not zero');
  });
  it('should not throw error if check is not passed', () => {
    expect(
      addToVirginEntities(Set([n3]), Set([n1, n2])).equals(Set([n1, n2, n3]))
    ).toEqual(true);
    expect(
      addToVirginEntities(Set([n3]), Set([n1, n3])).equals(Set([n1, n3]))
    ).toEqual(true);
    expect(
      addToVirginEntities(Set([n11]), Set([n1, n3])).equals(Set([n1, n11, n3]))
    ).toEqual(true);
  });
});

describe('removeFromVirginEntities', () => {
  it('should remove entities', () => {
    const virginEntities = Set([n1, n2, n3]);
    const toRemove = Set([n1.id]);
    const result = removeEntities(virginEntities, toRemove);
    expect(result.equals(Set([n2, n3]))).toBe(true);
  });
  it('should do nothing when empty entities', () => {
    const virginEntities = Set([n1, n2, n3]);
    const toRemove = Set([]);
    const result = removeEntities(virginEntities, toRemove);
    expect(result.equals(Set([n1, n2, n3]))).toBe(true);
  });
  it('should do nothing when have nothing in common ', () => {
    const virginEntities = Set([n1, n2, n3]);
    const toRemove = Set([n4.id]);
    const result = removeEntities(virginEntities, toRemove);
    expect(result.equals(Set([n1, n2, n3]))).toBe(true);
  });
  it('should remove everything when all entities id are sent', () => {
    const virginEntities = Set([n1, n2, n3]);
    const toRemove = Set([n1, n2, n3].map(r => r.id));
    const result = removeEntities(virginEntities, toRemove);
    expect(result.equals(Set())).toBe(true);
  });
});

describe('addToModifiedEntities', () => {
  it('should add to empty modifiedentities', () => {
    const result = addToModifiedEntities(Set([n1, n2]), Set());
    expect(result.equals(Set([n2, n1]))).toBe(true);
  });
  it('should add to modifiedentities', () => {
    const result = addToModifiedEntities(Set([n1, n2]), Set([n3]));
    expect(result.equals(Set([n2, n1, n3]))).toBe(true);
  });

  it('should update when entity exists in modifiedentities', () => {
    let result = addToModifiedEntities(Set([n1, n2]), Set([n11]));
    expect(result.equals(Set([n2, n11]))).toBe(true);

    result = addToModifiedEntities(Set([n1, n2]), Set([n1]));
    expect(result.equals(Set([n2, n1]))).toBe(true);

    result = addToModifiedEntities(Set([n1, n2]), Set([n11, n22]));
    expect(result.equals(Set([n22, n11]))).toBe(true);
  });

  it('should update whem empty modifiedentities', () => {
    const result = addToModifiedEntities(Set([]), Set([n2, n11]));
    expect(result.equals(Set([n2, n11]))).toBe(true);
  });
});
