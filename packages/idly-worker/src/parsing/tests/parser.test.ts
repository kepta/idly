import { ParentWays } from 'idly-common/lib/osm/structures';
import { wayFactory } from 'idly-common/lib/osm/wayFactory';

import {
  miniWayXML1,
  miniXML1,
  miniXML2,
  miniXML3,
  nodeXML1
} from '../../parsing/fixtures';
import { calculateParentWays, parseXML } from '../../parsing/parser';

const wayXML =
  '<?xml version="1.0" encoding="UTF-8"?><osm>' +
  '<way id="1" visible="true" timestamp="2008-01-03T05:24:43Z" version="1" changeset="522559"><nd ref="1"/></way>' +
  '</osm>';

describe('parsers', () => {
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

    it('works', () => {
      expect(calculateParentWays(new Map(), [])).toEqual(new Map());
    });
    it('takes existing parentways and returns them', () => {
      expect(calculateParentWays(parentWays, [])).toEqual(parentWays);
    });
    it('takes existing parentways and adds a way', () => {
      const w1 = wayFactory({ id: 'w', nodes: ['n'] });
      expect(calculateParentWays(parentWays, [w1]).get('n')).toEqual(
        new Set([w1.id])
      );
    });
    it('takes existing parentways and appends a way', () => {
      const w1 = wayFactory({ id: 'w', nodes: ['n253179996'] });
      expect(calculateParentWays(parentWays, [w1])).toMatchSnapshot();
    });
    it('takes handles words', () => {
      const w1 = wayFactory({ id: 'way-great', nodes: ['n-random'] });
      expect(calculateParentWays(parentWays, [w1]).get('n-random')).toEqual(
        new Set([w1.id])
      );
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
