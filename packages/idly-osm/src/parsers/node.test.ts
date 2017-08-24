import {
  genLngLat,
  nodeFactory,
  OsmGeometry,
  tagsFactory
} from 'idly-common/lib';

import { dummyParentWaysGen } from '../helpers/dummyParentWaysGen';
import { getNodeGeometry } from '../helpers/getNodeGeometry';

import {
  applyNodeMarkup,
  DEFAULT_NODE_ICON,
  nodePropertiesGen
} from '../parsers/node';

const n1 = nodeFactory({ id: 'n-1' });
const n11 = nodeFactory({
  id: 'n-1',
  loc: genLngLat({ lon: 15, lat: 10 }),
  tags: tagsFactory({ k: 'k' })
});

describe('node property generator', () => {
  it('should work', () => {
    expect(
      nodePropertiesGen(
        n1,
        dummyParentWaysGen({
          n3780767744: new Set(['w40542208']),
          n4558992269: new Set(['w40542208']),
          n253179996: new Set([
            'w40882200',
            'w237684574',
            'w173431854',
            'w450548831'
          ]),
          n1485636774: new Set(['w40882200', 'w135262258'])
        })
      )
    ).toMatchSnapshot();
  });

  describe('applyNodeMarkup', () => {
    it('should work', () => {
      const markup = applyNodeMarkup(
        OsmGeometry.POINT,
        tagsFactory({ k: 'k' })
      );
      expect(markup).toEqual({
        icon: DEFAULT_NODE_ICON,
        name: undefined,
        geometry: OsmGeometry.POINT
      });
    });
    it('should get the icon', () => {
      const markup = applyNodeMarkup(
        OsmGeometry.POINT,
        tagsFactory({ k: 'k' })
      );
      expect(markup).toEqual({
        icon: DEFAULT_NODE_ICON,
        name: undefined,
        geometry: OsmGeometry.POINT
      });
    });
    it('should get the name', () => {
      const markup = applyNodeMarkup(
        OsmGeometry.POINT,
        tagsFactory({ name: 'whatsInTheName' })
      );
      expect(markup).toEqual({
        icon: DEFAULT_NODE_ICON,
        name: 'whatsInTheName',
        geometry: OsmGeometry.POINT
      });
    });
  });
});
