import { OsmGeometry, ParentWays } from 'idly-common/lib/osm/structures';
import { getNodeGeometry } from '../helpers/getNodeGeometry';
import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';

function genParentWays() {
  const obj = {
    n3780767744: ImSet(['w40542208']),
    n4558992269: ImSet(['w40542208']),
    n253179996: ImSet(['w40882200', 'w237684574', 'w173431854', 'w450548831']),
    n1485636774: ImSet(['w40882200', 'w135262258'])
  };
  const parentWays: ParentWays = ImMap(obj);
  // Object.keys(obj).forEach(k => parentWays.set(k, obj[k]));
  return parentWays;
}

describe('getNodeGeometry', () => {
  it('should work for empty parentWays', () => {
    // @TOFIX new set after we move to immutable
    expect(getNodeGeometry('n1', ImSet())).toEqual(OsmGeometry.POINT);
  });
  // it('should work for not matching parentWays', () => {
  //   expect(getNodeGeometry('n1', genParentWays().get('n1'))).toEqual(
  //     OsmGeometry.POINT
  //   );
  // });
  it('should give vertex when inside a way', () => {
    expect(
      getNodeGeometry('n3780767744', genParentWays().get('n3780767744'))
    ).toEqual(OsmGeometry.VERTEX);
  });
  it('should give VERTEX when shared between vertices', () => {
    expect(
      getNodeGeometry('n253179996', genParentWays().get('n253179996'))
    ).toEqual(OsmGeometry.VERTEX);
  });
});
