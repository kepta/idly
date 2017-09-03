import { wayFactory } from 'idly-common/lib/osm/wayFactory';
import { tagsFactory } from 'idly-common/lib/osm/tagsFactory';
import { isArea } from '../helpers/isArea';

describe('#isArea', function() {
  //   const w1 = wayFactory({ id: 'w-1' });
  it('uses weak cache', function() {
    const w1 = wayFactory({
      id: 'w-1',
      nodes: ['n1', 'n1'],
      tags: tagsFactory([['building', 'yes']])
    });
    expect(isArea(w1)).toEqual(true);
    expect(isArea(w1)).toEqual(true);
  });
  it('returns false when the way has no tags', function() {
    expect(isArea(wayFactory({ id: 'w-1' }))).toEqual(false);
  });
  it('returns true if the way has tag area=yes', function() {
    expect(
      isArea(wayFactory({ id: 'w-1', tags: tagsFactory([['area', 'yes']]) }))
    ).toEqual(true);
  });
  it('returns false if the way is closed and has no tags', function() {
    expect(isArea(wayFactory({ id: 'w-1', nodes: ['n1', 'n1'] }))).toEqual(
      false
    );
  });
  it('returns true if the way is closed and has a key in areaKeys', function() {
    expect(
      isArea(
        wayFactory({
          id: 'w-1',
          nodes: ['n1', 'n1'],
          tags: tagsFactory([['building', 'yes']])
        })
      )
    ).toEqual(true);
  });
  it('returns false if the way is closed and has no keys in areaKeys', function() {
    expect(
      isArea(
        wayFactory({
          id: 'w-1',
          nodes: ['n1', 'n1'],
          tags: tagsFactory([['a', 'b']])
        })
      )
    ).toBe(false);
  });
  it('returns false if the way is closed and has tag area=no', function() {
    expect(
      isArea(
        wayFactory({
          id: 'w-1',
          nodes: ['n1', 'n1'],
          tags: tagsFactory([['area', 'no'], ['building', 'yes']])
        })
      )
    ).toBe(false);
  });
  it('returns false for coastline', function() {
    expect(
      isArea(
        wayFactory({
          id: 'w-1',
          nodes: ['n1', 'n1'],
          tags: tagsFactory([['natural', 'coastline']])
        })
      )
    ).toBe(false);
  });
});
