import { NODE_XML1, WAY_XML1, XML1, XML2, XML3 } from '../misc/fixtures';
import { xmlToEntities } from './xmlToEntities';

// tslint:disable:no-expression-statement
describe('parsers', () => {
  describe('node', () => {
    it('matches snapshot', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(XML2, 'text/xml');
      expect(xmlToEntities(xml)).toMatchSnapshot();
      expect(
        xmlToEntities(parser.parseFromString(XML1, 'text/xml')),
      ).toMatchSnapshot();
    });
    it('matches a bigger example', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(NODE_XML1, 'text/xml');
      expect(xmlToEntities(xml)).toMatchSnapshot();
    });
  });
  describe('way', () => {
    it('matches snapshot', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(WAY_XML1, 'text/xml');
      expect(xmlToEntities(xml)).toMatchSnapshot();
    });
  });

  describe('it makes good parentways', () => {
    it('matches snapshot', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(XML3, 'text/xml');
      expect(xmlToEntities(xml)).toMatchSnapshot();
    });
    it('reuses parent Ways and adds stuff to it', () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(XML3, 'text/xml');
      expect(xmlToEntities(xml)).toMatchSnapshot();
    });
  });
});
