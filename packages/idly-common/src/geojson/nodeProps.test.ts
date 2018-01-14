import { Map as ImMap, Set as ImSet } from 'immutable';

import {
  applyNodeMarkup,
  DEFAULT_NODE_ICON,
  nodePropertiesGen,
} from './nodeProps';

import { nodeFactory } from '../osm/nodeFactory';
import { ParentWays } from '../osm/structures';
import { OsmGeometry } from '../osm/structures';
import { tagsFactory } from '../osm/tagsFactory';

export function dummyParentWaysGen(obj: any): ParentWays {
  return ImMap(obj);
}

const n1 = nodeFactory({ id: 'n-1' });

const dummyParentWays = dummyParentWaysGen({
  n3780767744: ImSet(['w40542208']),
  n4558992269: ImSet(['w40542208']),
  n253179996: ImSet(['w40882200', 'w237684574', 'w173431854', 'w450548831']),
  n1485636774: ImSet(['w40882200', 'w135262258']),
});
describe('node property generator', () => {
  it('should work', () => {
    // @TOFIX change to immutable once finsished rolling out
    expect(
      nodePropertiesGen(n1, dummyParentWays.get(n1.id) || ImSet()),
    ).toMatchSnapshot();
  });

  describe('applyNodeMarkup', () => {
    it('should work', () => {
      const markup = applyNodeMarkup(
        OsmGeometry.POINT,
        tagsFactory({ k: 'k' }),
      );
      expect(markup).toEqual({
        icon: DEFAULT_NODE_ICON,
        name: undefined,
        geometry: OsmGeometry.POINT,
      });
    });
    it('should get the icon', () => {
      const markup = applyNodeMarkup(
        OsmGeometry.POINT,
        tagsFactory({ k: 'k' }),
      );
      expect(markup).toEqual({
        icon: DEFAULT_NODE_ICON,
        name: undefined,
        geometry: OsmGeometry.POINT,
      });
    });
    it('should get the name', () => {
      const markup = applyNodeMarkup(
        OsmGeometry.POINT,
        tagsFactory({ name: 'whatsInTheName' }),
      );
      expect(markup).toEqual({
        icon: DEFAULT_NODE_ICON,
        name: 'whatsInTheName',
        geometry: OsmGeometry.POINT,
      });
    });
  });
});
