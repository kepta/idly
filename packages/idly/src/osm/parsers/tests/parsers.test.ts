import { parseXML } from 'osm/parsers/parsers';
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
  describe('it makes good parentways', () => {
    it('matches snapshot', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(miniXML3, 'text/xml');
      expect(parseXML(xml)).toMatchSnapshot();
    });
  });
});
