import { List } from 'immutable';

import {
  _extend,
  area,
  center,
  contains,
  extend,
  GeoExtent,
  geoExtent,
  intersects,
  padByMeters,
  polygon,
  rectangle
} from 'osm/geo_utils/geo_extent';
import { genLngLat, LngLat } from 'osm/geo_utils/lng_lat';

describe('geoExtent', function() {
  const p0_0 = genLngLat({ lon: 0, lat: 0 });
  const p5_10 = genLngLat({ lon: 5, lat: 10 });
  const p1_1 = genLngLat([1, 1]);
  const p2_2 = genLngLat([2, 2]);
  const p5_5 = genLngLat([5, 5]);
  const p6_6 = genLngLat([6, 6]);
  const p7_7 = genLngLat([7, 7]);
  describe('constructor', function() {
    // it('defaults to infinitely empty extent', function() {
    //   expect(
    //     geoExtent().equals([[Infinity, Infinity], [-Infinity, -Infinity]])
    //   ).toBeTruthy();
    // });

    it('constructs via a point', function() {
      expect(geoExtent(p0_0)).toEqual(
        new GeoExtent({ lower: p0_0, upper: p0_0 })
      );
    });

    it('constructs via two points', function() {
      expect(geoExtent(p0_0, p5_10)).toEqual(
        new GeoExtent({ lower: p0_0, upper: p5_10 })
      );
    });

    it('has infinity when empty', function() {
      expect(geoExtent()).toMatchSnapshot();
    });

    it('has min element', function() {
      expect(geoExtent(p0_0, p5_10).lower).toEqual(p0_0);
    });

    it('has max element', function() {
      expect(geoExtent(p0_0, p5_10).upper).toEqual(p5_10);
    });
  });

  describe('#equals', function() {
    it('tests extent equality', function() {
      const p10_10 = genLngLat([10, 10]);
      const p12_12 = genLngLat([12, 12]);
      const e1 = geoExtent(p0_0, p10_10);
      const e2 = geoExtent(p0_0, p12_12);
      const e3 = geoExtent(p0_0, p12_12);
      expect(e1).toBeTruthy();
      expect(e1.equals(e3)).toBeFalsy();
    });
  });

  describe('#center', function() {
    it('returns the center point', function() {
      expect(center(geoExtent(p0_0, p5_10))).toEqual(genLngLat([2.5, 5]));
    });
  });

  describe('#rectangle', function() {
    it('returns the extent as a rectangle', function() {
      expect(rectangle(geoExtent(p0_0, p5_10))).toEqual(List([p0_0, p5_10]));
    });
  });

  describe('#polygon', function() {
    it('returns the extent as a polygon', function() {
      expect(polygon(geoExtent(p0_0, p5_10))).toEqual(
        List([
          p0_0,
          genLngLat([0, 10]),
          genLngLat([5, 10]),
          genLngLat([5, 0]),
          p0_0
        ])
      );
    });
  });

  describe('#area', function() {
    it('returns the area', function() {
      expect(area(geoExtent(p0_0, p5_10))).toEqual(50);
    });
  });

  describe('#padByMeters', function() {
    it('does not change centerpoint of an extent', function() {
      expect(center(padByMeters(100, geoExtent(p0_0, p5_10)))).toEqual(
        genLngLat([2.5, 5])
      );
    });

    it('does not affect the extent with a pad of zero', function() {
      expect(padByMeters(0, geoExtent(p0_0, p5_10)).lower).toEqual(p0_0);
    });
  });

  describe('#extend', function() {
    it('does not modify self', function() {
      const extent = geoExtent(p0_0, p0_0);
      extend(genLngLat(p1_1), extent);
      expect(extent).toEqual(extent);
    });

    it('returns the minimal extent containing self and the given point', function() {
      expect(extend(p0_0, geoExtent())).toEqual(geoExtent(p0_0, p0_0));
    });

    it('returns the minimal extent containing self and the given extent', function() {
      expect(
        extend(geoExtent(p0_0, p5_10), geoExtent()).equals(
          geoExtent(p0_0, p5_10)
        )
      ).toBeTruthy();
      expect(
        extend(
          geoExtent(genLngLat([4, -1]), genLngLat([5, 10])),
          geoExtent(p0_0, p0_0)
        ).equals(geoExtent(genLngLat([0, -1]), genLngLat([5, 10])))
      ).toBeTruthy();
    });
  });

  describe('#_extend', function() {
    it('extends self to the minimal extent containing self and the given extent', function() {
      const e = geoExtent();
      // e._extend([p0_0, [5, 10]]);
      expect(
        _extend(geoExtent(p0_0, p5_10), e).equals(geoExtent(p0_0, p5_10))
      ).toBeTruthy();
      expect(
        _extend(
          geoExtent(genLngLat([4, -1]), p5_10),
          geoExtent(p0_0, p0_0)
        ).equals(geoExtent(genLngLat([0, -1]), genLngLat([5, 10])))
      ).toBeTruthy();
    });
  });

  describe('#contains', function() {
    it('returns true for a point inside self', function() {
      expect(contains(p2_2, geoExtent(p0_0, p5_5))).toBe(true);
    });

    it('returns true for a point on the boundary of self', function() {
      expect(contains(p0_0, geoExtent(p0_0, p5_5))).toBe(true);
    });

    it('returns false for a point outside self', function() {
      expect(contains(p6_6, geoExtent(p0_0, p5_5))).toBe(false);
    });

    it('returns true for an extent contained by self', function() {
      expect(contains(geoExtent(p1_1, p2_2), geoExtent(p0_0, p5_5))).toBe(true);
      expect(contains(geoExtent(p0_0, p5_5), geoExtent(p1_1, p2_2))).toBe(
        false
      );
    });

    it('returns false for an extent partially contained by self', function() {
      expect(contains(geoExtent(p1_1, p6_6), geoExtent(p0_0, p5_5))).toBe(
        false
      );
      expect(contains(geoExtent(p0_0, p5_5), geoExtent(p1_1, p6_6))).toBe(
        false
      );
    });

    it('returns false for an extent not intersected by self', function() {
      expect(contains(geoExtent(p6_6, p7_7), geoExtent(p0_0, p5_5))).toBe(
        false
      );
      expect(contains(geoExtent(p0_0, p5_5), geoExtent(p6_6, p7_7))).toBe(
        false
      );
    });
  });

  describe('#intersects', function() {
    it('returns true for a point inside self', function() {
      expect(intersects(p2_2, geoExtent(p0_0, p5_5))).toBe(true);
    });

    it('returns true for a point on the boundary of self', function() {
      expect(intersects(p0_0, geoExtent(p0_0, p5_5))).toBe(true);

      // expect(geoExtent(p0_0, p5_5).intersects(p0_0)).toBe(true);
    });

    it('returns false for a point outside self', function() {
      expect(intersects(p6_6, geoExtent(p0_0, p5_5))).toBe(false);

      // expect(geoExtent(p0_0, p5_5).intersects(p6_6)).toBe(false);
    });

    it('returns true for an extent contained by self', function() {
      expect(intersects(geoExtent(p1_1, p2_2), geoExtent(p0_0, p5_5))).toBe(
        true
      );
      expect(intersects(geoExtent(p0_0, p5_5), geoExtent(p1_1, p2_2))).toBe(
        true
      );
    });

    it('returns true for an extent partially contained by self', function() {
      expect(intersects(geoExtent(p1_1, p6_6), geoExtent(p0_0, p5_5))).toBe(
        true
      );
      expect(intersects(geoExtent(p0_0, p5_5), geoExtent(p1_1, p6_6))).toBe(
        true
      );
    });

    it('returns false for an extent not intersected by self', function() {
      expect(intersects(geoExtent(p6_6, p7_7), geoExtent(p0_0, p5_5))).toBe(
        false
      );
      expect(intersects(geoExtent(p0_0, p5_5), geoExtent(p6_6, p7_7))).toBe(
        false
      );
    });
  });

  // describe.skip('#intersection', function() {
  //   it('returns an empty extent if self does not intersect with other', function() {
  //     const a = geoExtent(p0_0, p5_5),
  //       b = geoExtent(p6_6, p7_7);
  //     expect(a.intersection(b)).toEqual(geoExtent());
  //   });

  //   it('returns the intersection of self with other (1)', function() {
  //     const a = geoExtent(p0_0, p5_5),
  //       b = geoExtent([3, 4], p7_7);
  //     expect(a.intersection(b)).toEqual(geoExtent([3, 4], p5_5));
  //     expect(b.intersection(a)).toEqual(geoExtent([3, 4], p5_5));
  //   });

  //   it('returns the intersection of self with other (2)', function() {
  //     const a = geoExtent(p0_0, p5_5),
  //       b = geoExtent([3, -4], [7, 2]);
  //     expect(a.intersection(b)).toEqual(geoExtent([3, 0], [5, 2]));
  //     expect(b.intersection(a)).toEqual(geoExtent([3, 0], [5, 2]));
  //   });

  //   it('returns the intersection of self with other (3)', function() {
  //     const a = geoExtent(p0_0, p5_5),
  //       b = geoExtent([3, 3], [4, 7]);
  //     expect(a.intersection(b)).toEqual(geoExtent([3, 3], [4, 5]));
  //     expect(b.intersection(a)).toEqual(geoExtent([3, 3], [4, 5]));
  //   });

  //   it('returns the intersection of self with other (4)', function() {
  //     const a = geoExtent(p0_0, p5_5),
  //       b = geoExtent([3, -2], [4, 2]);
  //     expect(a.intersection(b)).toEqual(geoExtent([3, 0], [4, 2]));
  //     expect(b.intersection(a)).toEqual(geoExtent([3, 0], [4, 2]));
  //   });

  //   it('returns the intersection of self with other (5)', function() {
  //     const a = geoExtent(p0_0, p5_5),
  //       b = geoExtent(p1_1, p2_2);
  //     expect(a.intersection(b)).toEqual(geoExtent(p1_1, p2_2));
  //     expect(b.intersection(a)).toEqual(geoExtent(p1_1, p2_2));
  //   });
  // });

  // describe.skip('#percentContainedIn', function() {
  //   it('returns a 0 if self does not intersect other', function() {
  //     const a = geoExtent(p0_0, p1_1),
  //       b = geoExtent([0, 3], [4, 1]);
  //     expect(a.percentContainedIn(b)).toEqual(0);
  //     expect(b.percentContainedIn(a)).toEqual(0);
  //   });

  //   it('returns the percent contained of self with other (1)', function() {
  //     const a = geoExtent(p0_0, [2, 1]),
  //       b = geoExtent([1, 0], [3, 1]);
  //     expect(a.percentContainedIn(b)).toEqual(0.5);
  //     expect(b.percentContainedIn(a)).toEqual(0.5);
  //   });

  //   it('returns the percent contained of self with other (2)', function() {
  //     const a = geoExtent(p0_0, [4, 1]),
  //       b = geoExtent([3, 0], [4, 2]);
  //     expect(a.percentContainedIn(b)).toEqual(0.25);
  //     expect(b.percentContainedIn(a)).toEqual(0.5);
  //   });
  // });
});
