import { OsmGeometry, ParentWays } from 'idly-common/lib';
import { getNodeGeometry } from '../helpers/getNodeGeometry';

function genParentWays() {
  const obj = {
    n3780767744: new Set(['w40542208']),
    n4558992269: new Set(['w40542208']),
    n253179996: new Set([
      'w40882200',
      'w237684574',
      'w173431854',
      'w450548831'
    ]),
    n1485636774: new Set(['w40882200', 'w135262258'])
  };
  const parentWays: ParentWays = new Map();
  Object.keys(obj).forEach(k => parentWays.set(k, obj[k]));
  return parentWays;
}

describe('getNodeGeometry', () => {
  it('should work for empty parentWays', () => {
    expect(getNodeGeometry('n1', new Map())).toEqual(OsmGeometry.POINT);
  });
  it('should work for not matching parentWays', () => {
    expect(getNodeGeometry('n1', genParentWays())).toEqual(OsmGeometry.POINT);
  });
  it('should give vertex when inside a way', () => {
    expect(getNodeGeometry('n3780767744', genParentWays())).toEqual(
      OsmGeometry.VERTEX
    );
  });
  it('should give VERTEX_SHARED when shared between vertices', () => {
    expect(getNodeGeometry('n253179996', genParentWays())).toEqual(
      OsmGeometry.VERTEX_SHARED
    );
  });
});
