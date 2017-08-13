import { List, Map, Set } from 'immutable';
import { wayFactory } from 'osm/entities/way';
import { calculateParentWays, ParentWays, parseXML } from 'osm/parsers/parsers';
import {
  miniWayXML1,
  miniXML1,
  miniXML2,
  miniXML3,
  nodeXML1
} from 'osm/parsers/tests/fixtures';
// const nodeXML =
//   '<?xml version="1.0" encoding="UTF-8"?><osm>' +
//   '<node id="1" version="1" changeset="1" lat="0" lon="0" visible="true" timestamp="2009-03-07T03:26:33Z"></node>' +
//   '</osm>';

const wayXML =
  '<?xml version="1.0" encoding="UTF-8"?><osm>' +
  '<way id="1" visible="true" timestamp="2008-01-03T05:24:43Z" version="1" changeset="522559"><nd ref="1"/></way>' +
  '</osm>';
describe.only('parsers', () => {
  describe('node', () => {
    it('matches snapshot', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(miniXML2, 'text/xml');
      expect(parseXML(xml)).toMatchSnapshot();
      expect(
        parseXML(parser.parseFromString(miniXML1, 'text/xml'))
      ).toMatchSnapshot();
    });
    it('matches a bigger example', () => {
      const parser = new DOMParser();
      const XML = nodeXML1;
      const xml = parser.parseFromString(XML, 'text/xml');
      expect(parseXML(xml)).toMatchSnapshot();
    });
  });
  describe('way', () => {
    it('matches snapshot', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(miniWayXML1, 'text/xml');
      expect(parseXML(xml)).toMatchSnapshot();
    });
  });
  describe('calculateParentWays ', () => {
    const parentWays: ParentWays = Map({
      n3780767744: Set<string>(['w40542208']),
      n4558992269: Set<string>(['w40542208']),
      n253179996: Set<string>([
        'w40882200',
        'w237684574',
        'w173431854',
        'w450548831'
      ]),
      n1485636774: Set<string>(['w40882200', 'w135262258'])
    });
    it('works', () => {
      expect(calculateParentWays(Map(), [])).toEqual(Map());
    });
    it('takes existing parentways and returns them', () => {
      expect(calculateParentWays(parentWays, [])).toEqual(parentWays);
    });
    it('takes existing parentways and adds a way', () => {
      const w1 = wayFactory({ id: 'w', nodes: List(['n']) });
      const newParentWay = parentWays.set('n', Set([w1.id]));
      expect(calculateParentWays(parentWays, [w1])).toEqual(newParentWay);
    });
    it('takes existing parentways and appends a way', () => {
      const w1 = wayFactory({ id: 'w', nodes: List(['n253179996']) });
      const newParentWay = parentWays.update('n253179996', n => n.add(w1.id));
      expect(calculateParentWays(parentWays, [w1])).toEqual(newParentWay);
    });
  });
  describe('it makes good parentways', () => {
    it('matches snapshot', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(miniXML3, 'text/xml');
      expect(parseXML(xml)).toMatchSnapshot();
    });
    it('reuses parent Ways and adds stuff to it', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(miniXML3, 'text/xml');
      expect(parseXML(xml)).toMatchSnapshot();
    });
  });
});
