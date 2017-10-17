import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';
import { ParentWays } from 'idly-common/lib/osm/structures';
import { wayFactory } from 'idly-common/lib/osm/wayFactory';

import {
  miniWayXML1,
  miniXML1,
  miniXML2,
  miniXML3,
  nodeXML1,
} from '../misc/fixtures';
import { xmlToEntities } from './xmlToEntities';

const wayXML =
  '<?xml version="1.0" encoding="UTF-8"?><osm>' +
  '<way id="1" visible="true" timestamp="2008-01-03T05:24:43Z" version="1" changeset="522559"><nd ref="1"/></way>' +
  '</osm>';

// tslint:disable:no-expression-statement
describe('parsers', () => {
  describe('node', () => {
    it('matches snapshot', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(miniXML2, 'text/xml');
      expect(xmlToEntities(xml)).toMatchSnapshot();
      expect(
        xmlToEntities(parser.parseFromString(miniXML1, 'text/xml')),
      ).toMatchSnapshot();
    });
    it('matches a bigger example', () => {
      const parser = new DOMParser();
      const XML = nodeXML1;
      const xml = parser.parseFromString(XML, 'text/xml');
      expect(xmlToEntities(xml)).toMatchSnapshot();
    });
  });
  describe('way', () => {
    it('matches snapshot', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(miniWayXML1, 'text/xml');
      expect(xmlToEntities(xml)).toMatchSnapshot();
    });
  });

  describe('it makes good parentways', () => {
    it('matches snapshot', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(miniXML3, 'text/xml');
      expect(xmlToEntities(xml)).toMatchSnapshot();
    });
    it('reuses parent Ways and adds stuff to it', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(miniXML3, 'text/xml');
      expect(xmlToEntities(xml)).toMatchSnapshot();
    });
  });
});
